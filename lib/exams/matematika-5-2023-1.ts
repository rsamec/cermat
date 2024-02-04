import { group, number } from "../utils/quiz-builder";

const form = group({
  1: number(20, { suffix: 'minut' }),
});
export default form;