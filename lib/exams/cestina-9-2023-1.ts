import { AnswerBuilder } from "../utils/form-answers";
const group = AnswerBuilder.group;
const form = group({
  1: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputType: 'options' },

});
export default form;