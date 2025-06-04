import OpenAI from "openai";
import { loadJson, loadMarkdownWithAbsoluteImagesUrl } from "../utils/file.utils";
import { store } from "../store";
import { convertTree } from "../utils/quiz-specification";
import { QuizTagsFileSaver } from "./file.utils";
import examTestCases from "../exams.utils";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
//const modelName = "gpt-4o-2024-08-06";
const modelName = "gpt-4o";


export async function main() {

  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const { dispatch } = store;


  for (let quizTestCase of examTestCases) {
    const { pathes } = quizTestCase;
    const [subject, grade, code] = pathes;


    //load quiz
    const quizContent = await loadMarkdownWithAbsoluteImagesUrl(pathes);

    const quiz = await loadJson([`${code}.json`]);

    const tree = convertTree(quiz as any);
    await dispatch.quiz.initAsync({ tree, assetPath: pathes });

    const response = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system", content: `You are an expert at finding the right keywords from ${subject} subject. You will be given quiz with questions.
         The quiz format is markdown text. Each question is identified by markdown headings. Some question can have sub questions.
         Return json format as array of key value pair where key is question id and value should be the extracted keywords.
         `
        },
        {
          role: 'assistant',
          content: `
        # heading is root questions - question id is idenfied by format # {number} - for output return question key format is {number}
        ## heading is sub question - question id is idenfied by format ## {number}.{number} - for output return question key format is {number}.{number}
      `},
        {
          role: "user", content: [
            { type: "text", text: quizContent },
            {
              type: "text", text: `Please extract and assign keywords to each root question in a quiz. Do not assign keyword to sub questions. 
              Use only czech language keywords.
              Use keywords that can be used as social media hashtags. Make every word lowercase, prepend a hash '#' in front of every word. Remove the last '#' 
              If question content is short text generate only 1 keyword, otherwise for longer text limit the number of keywords to 4 per question. 
              ` },
          ]
        },
      ],
      response_format: //zodResponseFormat(MathQuizCategorization, "mathquiz")
        { "type": "json_object" }
      ,
      temperature: 1.,
      max_tokens: 1000,
      top_p: 1.
    });

    const result = response.choices[0].message.content;
    if (result != null) {

      const parsedResult = JSON.parse(result) as any
      console.log(pathes, Object.values(parsedResult))
      new QuizTagsFileSaver({ model: modelName }).updateJSONFile(code, parsedResult)
    }
    else {
      console.log(response)
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});