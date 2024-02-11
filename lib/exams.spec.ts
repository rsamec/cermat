import { test, expect } from "vitest";
import { Answer, AnswerTreeNode, calculateMaxTotalPoints, convertTree } from "./utils/quiz-specification";
import { GFM, Subscript, Superscript, parser } from '@lezer/markdown';
import { Maybe, matchNumberListCount } from "./utils/utils";
import { TreeNode, createTree, getAllLeafsWithAncestors } from "./utils/tree.utils";
import { loadMarkdown } from "./utils/file.utils";
import { Abbreviations, OptionList, ParsedQuestion, ShortCodeMarker, chunkHeadingsList } from "./utils/parser.utils";

import mat5_2023_1 from './exams/M5A-2023';
import mat9_2023_1 from './exams/M9A-2023';
import cz5_2023_1 from './exams/C5A-2023';
import cz9_2023_1 from './exams/C9A-2023';
import cestina7 from './exams/C7A-2023';

import cestina5B from './exams/C5B-2023';
import cestina9B from './exams/C9B-2023';

async function testQuestionDifference(pathes: string[], tree: TreeNode<AnswerTreeNode<any>>) {
  const questions = await parseMarkdownTree(pathes);
  const leafs = getAllLeafsWithAncestors(tree);
  //console.log(leafs.map(d => d.leaf.data.id), questions.map(d => d.header))
  expect(leafs.length, `Total: ${leafs.length}, Total headers: ${questions.length}\n${leafs.map((d, i) => d.leaf.data.id.padEnd(6, ' ') + questions[i]?.header).join("\n")}`).toBe(questions.length);

  const differences = leafs.reduce((out: { questionId: string, questionHeader: string }[], d, i) => {
    const questionId = d.leaf.data.id;
    const questionHeader = questions[i].header
    const matched = questionHeader.startsWith(matchNumberListCount(d.leaf.data.id));
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


test.each([
  { quiz: mat5_2023_1, pathes: ["math", "8", "M5A-2023"] },
  { quiz: mat9_2023_1, pathes: ["math", "4", "M9A-2023"] },
  { quiz: cz5_2023_1, pathes: ["cz", "8", "C5A-2023"] },
  { quiz: cestina5B, pathes: ["cz", "8", "C5B-2023"] },
  { quiz: cestina7, pathes: ["cz", "6", "C7A-2023"] },
  { quiz: cz9_2023_1, pathes: ["cz", "4", "C9A-2023"] },
  { quiz: cestina9B, pathes: ["cz", "4", "C9B-2023"] },
])(`exam validate $pathes`, async ({ quiz, pathes }) => {
  const tree = convertTree(quiz);
  expect(calculateMaxTotalPoints(tree)).toBe(50);
  await testQuestionDifference(pathes, tree)
})
