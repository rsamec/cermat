import OpenAI from "openai";
import { loadMarkdownWithAbsoluteImagesUrl } from "../utils/file.utils";
import examTestCases from "../exams.utils";

import { ShortCodeMarker, getQuizBuilder } from "../utils/parser.utils";
import { parser, GFM, Subscript, Superscript } from '@lezer/markdown';
import { QuizDetailAnswerFileSaver } from "./file.utils";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const markdownParser = parser.configure([[ShortCodeMarker], GFM, Subscript, Superscript]);

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "o1-mini";

export async function main() {

  const usePaidApi = false;
  const client = usePaidApi ? new OpenAI({
    organization: "org-u9Q9NxhzuntTO1rgjfl2Kkaq",
    project: "proj_3AmxUiUlFDCV0xxQD5DteczY",
  }) : new OpenAI({ baseURL: endpoint, apiKey: token });


  const storage = new QuizDetailAnswerFileSaver({ model: modelName });
  const quizTestCases = examTestCases
    .filter(d => d.config.questions)

  for (let quizTestCase of quizTestCases) {
    const { pathes } = quizTestCase;
    const [subject, grade, code] = pathes;

    if (storage.containsKey(code)) {
      console.log(`${code} already exists. skipping ....`);
      continue;
    }


    //load quiz questions
    const quizContent = await loadMarkdownWithAbsoluteImagesUrl(pathes);

    //parse quiz questions
    const contentTree = markdownParser.parse(quizContent);
    const quizBuilder = getQuizBuilder(contentTree, quizContent);

    const questions = quizBuilder.questions.map(d => d.id)

    console.log("Questions", questions);

    let data: Record<string, string> = {}

    for await (let key of questions) {
      const text = quizBuilder.content(subject == "math" || subject == "cz" ? [key] : [key]);
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "user", content: `You are an expert at ${subject === 'math' ? 'math' : subject === 'cz' ? 'czech language' : `${subject} language`}.
            You will be given quiz with questions. The quiz format is markdown text in czech language.
            Output text should be in the czech language.`
          },
          {
            role: "user", content: [
              { type: "text", text },
            ]
          },
        ],
        temperature: 1.,
        max_completion_tokens: 5000,
        top_p: 1.
      });
      console.log(response);

      const result = response.choices[0].message.content;

      if (result != null) {
        // Update the data with new key-value pair       
        data[key] = result;
        storage.updateJSONFile(code, data)

      }
      else {
        console.log(response)
      }

      await delay(5000); // Wait for 5 second between each iteratio
    }
    //storage.updateJSONFile(code, data)

  }

}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});