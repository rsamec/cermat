import { Answer, AnswerMetadata, convertTree } from "./quiz-specification";
import { z } from "zod";
import { getAllLeafsWithAncestors, LeafWithAncestors } from "./tree.utils";

const optionsEnum = z.enum(["A", "B", "C", "D", "E", "F"]);

export function quizSchema(quizMetadata: any) {
  const questions = getAllLeafsWithAncestors(convertTree(quizMetadata));
  // const answerWithExplanation = (d:LeafWithAncestors<Answer<any>>) => z.object({
  //   final_answer: convertToZodType(d.leaf.data.node as any),
  //   explanation: z.string().describe("Vysvětli konečnou odpověď na otázku. Použij markdown formát.")
  // });
  const schema = z.object(Object.fromEntries(questions.map(d => [d.leaf.data.id, convertToZodType(d.leaf.data.node as any)])))
  return schema;
}
function convertToZodType(node: AnswerMetadata<any>) {
  switch (node.verifyBy.kind) {    
    case 'equalRatio':
      return z.string().describe("use format {number}:{number}")
    case 'equalLatexExpression':
      return z.string().describe(`use latex formating`)
    case 'equalMathEquation':
    case 'equalMathExpression':
      return z.string().describe(`do not use latex formating, use simple math string, for fraction use slash symbol, for powers use caret symbol`)
    case 'equal':
      return typeof node.verifyBy.args == 'number'
        ? z.number()
        : typeof node.verifyBy.args == "string"
          ? z.string()
          : z.object(Object.fromEntries(Object.keys(node.verifyBy.args).map(key => [key, z.string()])));
    case 'matchObjectValues':
      return z.object(Object.fromEntries(Object.keys(node.verifyBy.args).map(key => [key, z.string()])));
    case 'equalNumberCollection':
      return z.array(z.number())
    case 'equalStringCollection':
      return z.array(z.string())
    case 'equalSortedOptions':
      return z.array(optionsEnum)
    case 'equalOption':
      return z.object({ value: typeof node.verifyBy.args == 'boolean' ? z.boolean() : optionsEnum });
    default:
      return z.string();
  }
}