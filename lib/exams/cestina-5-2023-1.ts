import { AnswerBuilder } from "../utils/quiz-specification";
const group = AnswerBuilder.group;
const form = group({
  1: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputBy: { kind: 'options' } },

});
export default form;