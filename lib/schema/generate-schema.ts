import { loadJson } from "../utils/file.utils";
import { AnswerGroup } from "../utils/quiz-specification";
import examTestCases from "../exams.utils";
import { quizSchema } from "../utils/zod.utils";
import { zodResponseFormat } from "openai/helpers/zod";
import { QuizAnswerSchemaFileSaver } from "../ai/file.utils";


export async function main() {

  //const storage = new QuizAnswerFileSaver({ model: modelName });
  
  let filtredQuizTestCase = examTestCases
  console.log(`Total tests: ${examTestCases.length}, filtred: ${filtredQuizTestCase.length}`);  
  

  
  for (let quizTestCase of filtredQuizTestCase) {
    const { pathes } = quizTestCase;
    const [subject, grade, code] = pathes;

    //load quiz metadata
    const quiz = await loadJson<AnswerGroup<any>>([`${code}.json`]);

    var result = zodResponseFormat(quizSchema(quiz), code)
    console.log(result);
    new QuizAnswerSchemaFileSaver({code}).saveJSONToFile(result.json_schema)
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});