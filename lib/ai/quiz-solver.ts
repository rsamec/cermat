import OpenAI from "openai";
import { loadJson, loadMarkdownWithAbsoluteImagesUrl } from "../utils/file.utils";
import { store } from "../../lib/store";
import { AnswerGroup, convertTree, getChildrenIdsByGroup } from "../utils/quiz-specification";
import examTestCases from "../exams.utils";
import { quizSchema } from "../utils/zod.utils";
import { zodResponseFormat } from "openai/helpers/zod";

import { ShortCodeMarker, getQuizBuilder } from "../utils/parser.utils";
import { parser, GFM, Subscript, Superscript } from '@lezer/markdown';
import { chunk } from "../utils/utils";
import { QuizAnswerFileSaver } from "./file.utils";

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))
const markdownParser = parser.configure([[ShortCodeMarker], GFM, Subscript, Superscript]);

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
//const modelName = "gpt-4o-2024-08-06";
const modelName = "gpt-4o";

const chunkSize = 6;
export async function main() {

  const usePaidApi = true;
  const client = usePaidApi ? new OpenAI({
      organization: "org-u9Q9NxhzuntTO1rgjfl2Kkaq",
      project: "proj_3AmxUiUlFDCV0xxQD5DteczY",
  }): new OpenAI({ baseURL: endpoint, apiKey: token });

  const storage = new QuizAnswerFileSaver({ model: modelName });
  let filtredQuizTestCase = examTestCases.filter(d => d.config.questions && !storage.containsKey(d.pathes[2]));
  console.log(filtredQuizTestCase.map(d => d.pathes));
  console.log(`Total tests: ${examTestCases.length}, filtred: ${filtredQuizTestCase.length}`);  
  const { dispatch } = store;


  for (let quizTestCase of filtredQuizTestCase) {
    const { pathes } = quizTestCase;
    const [subject, grade, code] = pathes;

    //load quiz questions
    const quizContent = await loadMarkdownWithAbsoluteImagesUrl(pathes);

    //parse quiz questions
    const contentTree = markdownParser.parse(quizContent);
    const quizBuilder = getQuizBuilder(contentTree, quizContent);

    //const questionChunks = chunk(quizBuilder.questions.map(d => d.id), 5);
    //console.log("Questions", questionChunks);


    //load quiz metadata
    const quiz = await loadJson<AnswerGroup<any>>([`${code}.json`]);

    const rootChildrenIds = Object.keys(quiz.children).map(d => parseInt(d, 10));
    const chunkedChildren = chunk(rootChildrenIds, chunkSize);
    console.log("Chunked children", chunkedChildren);


    //init quiz model
    await dispatch.quiz.initAsync({ tree: convertTree(quiz), assetPath: pathes });

    const metadataChildren = quiz.children;
    const chunkedDatas = chunkedChildren.map(d => ({
      metadata: {
        children: Object.fromEntries(Object.entries(metadataChildren)
          .filter(([key, value]) => d.includes(parseInt(key, 10))))
      },
      content: quizBuilder.content(subject == "math" || subject == "cz" ? d : getChildrenIdsByGroup(quiz, d))
    }))

    for await (let chunkedData of chunkedDatas) {
      //console.log(chunkedData.metadata.children)
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "system", content: `You are an expert at ${subject === 'math' ? 'math' : subject === 'cz' ? 'czech language' : `${subject} language`}.
            You will be given quiz with questions. The quiz format is markdown text.
            Each question is identified by markdown headings. Some question can have sub questions.
            - # heading is root questions - question id is identified by format # {number}
            - ## heading is sub question - question id is identified by format ## {number}.{number}`
          },
          {
            role: "user", content: [
              { type: "text", text: "Solve the quiz questions and return the final answer for each question or sub question. Do not include steps to explain the result." },
              { type: "text", text: chunkedData.content },
            ]
          },
        ],
        response_format: zodResponseFormat(quizSchema(chunkedData.metadata), code)
        //{ "type": "json_object" }
        ,
        temperature: 1.,
        max_tokens: 2000,
        top_p: 1.
      });
      console.log(response);

      const result = response.choices[0].message.content;
      //console.log(chunkedData.content)
      console.log(result);
      if (result != null) {

        //const parsedResult = JSON.parse(result) as Record<string, { final_answer: any, explanation: string }>
        //dispatch.quiz.submitQuiz(Object.fromEntries(Object.entries(parsedResult).map(([key,value]) => [key,value.final_answer])));
        const parsedResult = JSON.parse(result) as Record<string, string>
        dispatch.quiz.submitQuiz(parsedResult);

        const quizState = store.getState().quiz;
        console.log(pathes, quizState.totalPoints)

        storage.updateJSONFile(code, parsedResult)

      }
      else {
        console.log(response)
      }
      
      await delay(5000); // Wait for 5 second between each iteratio
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});