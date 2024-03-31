import { test, expect } from "vitest";
import { Answer, AnswerGroup, AnswerGroupImpl, AnswerTreeNode, calculateMaxTotalPoints, convertTree } from "./utils/quiz-specification";
import { GFM, Subscript, Superscript, parser } from '@lezer/markdown';
import { Maybe, matchNumberListCount } from "./utils/utils";
import { TreeNode, createTree, getAllLeafsWithAncestors } from "./utils/tree.utils";
import { loadMarkdown } from "./utils/file.utils";
import { Abbreviations, OptionList, ParsedQuestion, ShortCodeMarker, chunkHeadingsList } from "./utils/parser.utils";

import examTestCases from "./exams.utils";

function isLanguageTest(subject: string){
  return !(subject == "math" || subject == "cz")
}

async function testQuestionDifference(pathes: string[], tree: TreeNode<AnswerTreeNode<any>>) {
  const questions = await parseMarkdownTree(pathes);
  const leafs = getAllLeafsWithAncestors(tree);
  //console.log(leafs.map(d => d.leaf.data.id), questions.map(d => d.header))
  expect(leafs.length, `Total: ${leafs.length}, Total headers: ${questions.length}\n${leafs.map((d, i) => d.leaf.data.id.padEnd(6, ' ') + questions[i]?.header).join("\n")}`).toBe(questions.length);

  const differences = leafs.reduce((out: { questionId: string, questionHeader: string }[], d, i) => {
    let questionId = d.leaf.data.id;
    if (isLanguageTest(pathes[0])){
      questionId = questionId.split(".")[1]
    }
    const questionHeader = questions[i].header
    const matched = questionHeader.startsWith(matchNumberListCount(questionId));
    if (!matched) out.push({ questionId, questionHeader })
    return out;
  }, []);
  expect(differences, `Diffs: ${differences}`).toEqual([])
}

async function parseMarkdownTree(pathes: string[]) {
  const quizContent = await loadMarkdown(pathes.concat(['index.md']));


  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);
  const headings = chunkHeadingsList(parsedTree, quizContent);

  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTreeNodes = createTree(headings.map(d => ({ data: d })),
    (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));

  const questions = getAllLeafsWithAncestors({ data: {} as ParsedQuestion, children: headingsTreeNodes }, (parent, child) => {
    //copy some children property bottom up from leafs to its parent
    if (parent.options?.length === 0 && child.options?.length > 0) {
      parent.options = child.options;
    }
  }).map(d => ({
    header: d.leaf.data.header,
    options: d.leaf.data.options?.length > 0 ? d.leaf.data.options : d.ancestors[d.ancestors.length - 2].data.options
  }));
  return questions;
}


test.each(examTestCases)(`compute total questions $pathes`, ({ quiz, pathes }) => {
  const questions = !isLanguageTest(pathes[0])
    ? Object.entries(quiz.children)
    : getAllLeafsWithAncestors(convertTree(quiz));

  const expectedQuestions = quiz.metadata?.info?.questions;
  expect(questions.length).toBe((expectedQuestions?.closed ?? 0) + (expectedQuestions?.opened ?? 0));
})

test.each(examTestCases)(`compute total max points $pathes`, ({ quiz, pathes }) => {
  const tree = convertTree(quiz);
  expect(calculateMaxTotalPoints(tree)).toBe(quiz.metadata?.info?.maxPoints);
})

test.each(examTestCases.filter(d => d.config.questions))(`validate exam structure $pathes`, async ({ quiz, pathes }) => {
  const tree = convertTree(quiz);
  await testQuestionDifference(pathes, tree)
})


test("statistics", () => {
  const computeStatistics = (exams:{pathes:string[]}[]) => exams.reduce((out,d) => {
    const key = d.pathes[0];    
    out[key] = (out[key] ?? 0) + 1
   return out;
  },{} as {[index:string]: number})

  console.log(computeStatistics(examTestCases));
  console.log(computeStatistics(examTestCases.filter(d => d.config.questions)));
})