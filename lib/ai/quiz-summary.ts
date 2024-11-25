import { loadJson } from "../utils/file.utils";
import { store } from "../store";
import { AnswerGroup, convertTree } from "../utils/quiz-specification";
import { QuizResultsFileSaver } from "./file.utils";
import examTestCases from "../exams.utils";
import { TreeNode } from "../utils/tree.utils";

const modelName = "gpt-4o";

const selection = store.select((models) => ({
  totalAnswers: models.quiz.totalAnswers,
  points: models.quiz.points
}));

function isBool(value: any) {
  return (typeof value === "boolean" || value === "true" || value === "false")
}
function convertAnswerToString(value: any): string | number | undefined {
  if (value == null) return;
  return isBool(value)
    ? (value ? 'Ano' : 'Ne')
    : typeof value === "string" || typeof value === "number"
      ? value
      : Array.isArray(value) ?
        value.join(",") :
        value.value != null
          ? isBool(value.value) ? (value.value ? 'Ano' : 'Ne') : value.value?.toString()
          : JSON.stringify(value);
}

export async function main() {

  const { dispatch } = store;


  for (let quizTestCase of examTestCases) {
    const { pathes } = quizTestCase;

    //load quiz metada
    const [subject, grade, code] = pathes;
    const quizSpec = await loadJson<AnswerGroup<TreeNode<AnswerGroup<any>>[]>>([`${code}.json`]);

    //load quiz answers
    const answers = await loadJson([`quiz-answers-${modelName}.json`]) as Record<string, any>;

    const result = answers[code];
    if (result != null) {

      //init quiz model
      await dispatch.quiz.initAsync({ tree: convertTree(quizSpec), assetPath: pathes });
      //submit answers
      dispatch.quiz.submitQuiz(result);
      //get quiz state
      const rootState = store.getState();
      const { quiz } = rootState;
      const additionalQuizValues = selection(rootState as never);

      const quizResultSummary = {
        metadata: quizSpec.metadata,
        subject,
        grade,
        totalAnswers: additionalQuizValues.totalAnswers,
        totalPoints: quiz.totalPoints,
        maxTotalPoints: quiz.maxTotalPoints,
        corrections: quiz.corrections,
        correctAnswers: quiz.questions.reduce((out, d) => {
          const verify = d.node.verifyBy;
          out[d.id] = verify.kind == "selfEvaluate"
            ? (verify.args.hint.kind === "image"
              ? `https://raw.githubusercontent.com/rsamec/cermat/main/public/${subject}/${grade}/${code}/${verify.args.hint.src}`
              : verify.args.hint.content) 
            : verify.kind == "matchObjectValues"
            ? convertAnswerToString(verify.source)
            : verify.kind == "match"
                ? verify.args.source
                : convertAnswerToString(verify.args);
          return out;
        }, {} as Record<string, string | number | undefined>),
        answers: Object.entries(result).reduce((out, [key, value]) => {
          out[key] = convertAnswerToString(value)
          return out;
        }, {} as Record<string, string | number | undefined>),
        points: additionalQuizValues.points,
      }
      console.log(pathes, quiz.totalPoints)


      new QuizResultsFileSaver({ model: modelName }).updateJSONFile(code, quizResultSummary)
    }
    else {
      console.log(`Quiz ${code} - answers not found.`)
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});