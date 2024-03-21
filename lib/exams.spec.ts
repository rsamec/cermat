import { test, expect } from "vitest";
import { Answer, AnswerGroup, AnswerGroupImpl, AnswerTreeNode, calculateMaxTotalPoints, convertTree } from "./utils/quiz-specification";
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
import mat7_2023_1 from './exams/M7A-2023';
import mat9A_2023_1 from './exams/M9A-2023';
import mat7B_2023_1 from './exams/M7B-2023';
import mat5B_2023_1 from './exams/M5B-2023';
import mat9B_2023_1 from './exams/M9B-2023';
import aja_2023 from './exams/AJA-2023';


import cestina5B from './exams/C5B-2023';
import cestina9B from './exams/C9B-2023';
import cz_2023_A from './exams/CMA-2023';
import cz_2023_B from './exams/CMB-2023';
import cestina9C from './exams/C9C-2023';
import M5B_2023 from './exams/M5B-2023';
import MMA_2023 from './exams/MMA-2023';

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

const cz8Years = ["cz", "8"];
const cz4Years = ["cz", "4"];
const cz6Years = ["cz", "6"];
const czDimploma = ["cz", "diploma"];
const math8Years = ["math", "8"];
const math4Years = ["math", "4"];
const math6Years = ["math", "6"];
const mathDiploma = ["math", "diploma"];
const enDiploma = ["en", "diploma"];


const examTestCases: { quiz: AnswerGroup<any>, pathes: string[] }[] = [
  { quiz: mat5_2023_1, pathes: math8Years.concat("M5A-2023") },
  { quiz: mat9_2023_1, pathes: math4Years.concat("M9A-2023") },
  { quiz: cz5_2023_1, pathes: cz8Years.concat("C5A-2023") },
  { quiz: cestina5B, pathes: cz8Years.concat("C5B-2023") },
  { quiz: cestina7, pathes: cz6Years.concat("C7A-2023") },
  { quiz: cz9_2023_1, pathes: cz4Years.concat("C9A-2023") },
  { quiz: cestina9B, pathes: cz4Years.concat("C9B-2023") },
  { quiz: cestina9C, pathes: cz4Years.concat("C9C-2023") },
  { quiz: cz_2023_A, pathes: czDimploma.concat("CMA-2023") },
  { quiz: cz_2023_B, pathes: czDimploma.concat("CMB-2023") },
  { quiz: mat7_2023_1, pathes: math6Years.concat("M7A-2023") },
  { quiz: mat9A_2023_1, pathes: math4Years.concat("M9A-2023") },
  { quiz: mat7B_2023_1, pathes: math6Years.concat("M7B-2023") },
  { quiz: mat5B_2023_1, pathes: math8Years.concat("M5B-2023") },
  { quiz: mat9B_2023_1, pathes: math4Years.concat("M9B-2023") },  
  { quiz: M5B_2023, pathes: math8Years.concat("M5B-2023") },
  { quiz: MMA_2023, pathes: mathDiploma.concat("MMA-2023") },
  { quiz: aja_2023, pathes: enDiploma.concat("AJA-2023") },

]

test.each(examTestCases)(`compute total max points $pathes`, ({ quiz, pathes }) => {
  const tree = convertTree(quiz);
  expect(calculateMaxTotalPoints(tree)).toBe(50);
})

test.each(examTestCases)(`validate exam structure $pathes`, async ({ quiz, pathes }) => {
  const tree = convertTree(quiz);
  await testQuestionDifference(pathes, tree)
})
