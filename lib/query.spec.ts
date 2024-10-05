import { test } from "vitest";
import { defineTable, Schema, NewTableRow } from "squid"
import { sql, spreadInsert, } from "squid/pg"
import { createTree, getAllLeafsWithAncestors } from "./utils/tree.utils";

import { AnswerMetadata, convertTree } from "./utils/quiz-specification";
import { GFM, Subscript, Superscript, parser } from "@lezer/markdown";
import { loadMarkdown, loadMarkdownWithAbsoluteImagesUrl } from "./utils/file.utils";
import { ShortCodeMarker, OptionList, chunkHeadingsList, Abbreviations, QuestionHtml, countMaxChars, extractNumberRange, } from "./utils/parser.utils";
import { Maybe } from "./utils/utils";
import { getVerifyFunction } from "./utils/assert";
import { uuidv4 } from "../tests/test.utils";
import markdownToHtml from "./utils/markdown";
import { isBoolean, isNumber } from "mathjs";
import examTestCases from "./exams.utils";

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { GradeType, SubjectType, gradeLabel, subjectLabel } from "../components/utils/exam";


export type NewQuizRecord = NewTableRow<typeof quizTable>
export type NewQuestionRecord = NewTableRow<typeof questionsTable>
export type NewChoiceRecord = NewTableRow<typeof choicesTable>

const quizTable = defineTable("quizes", {
  id: Schema.String,
  name: Schema.String,
  code: Schema.String,
})

const questionsTable = defineTable("questions", {
  id: Schema.String,
  body: Schema.String,
  order: Schema.Number,
  quiz_id: Schema.String
})

const choicesTable = defineTable("choices", {
  id: Schema.String,
  question_id: Schema.String,
  body: Schema.String,
  is_correct: Schema.Boolean
})
function replaceValues({ text, values }: { text: string, values: any[] }): string {
  return text.replace(/\$(\d+)/g, (match: string, index: string) => {
    const valueIndex: number = parseInt(index) - 1;
    const value = values[valueIndex];

    return value !== undefined ? isNumber(value) || isBoolean(value) ? value.toString() : `'${value}'` : match;
  });
}
async function parseMarkdownTree(pathes: string[]) {
  const quizContent = await loadMarkdown(pathes.concat(['index.md']));

  const absolutePathes = ["https://www.eforms.cz"].concat(pathes)
  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);
  const headings = chunkHeadingsList(parsedTree, quizContent);

  const contentHeadings = await Promise.all(headings.map(async (d) => ({
    ...d,
    options: d.options.length > 0 ? await Promise.all(d.options.map(async opt => ({
      ...opt,
      name: await markdownToHtml(opt.name, { path: absolutePathes })
    }))) : d.options,
    contentHtml: d.type?.name == Abbreviations.ST ? await markdownToHtml(d.content, { path: absolutePathes }) : (await markdownToHtml(d.header, { path: absolutePathes }) + await markdownToHtml(d.content, { path: absolutePathes })),
  })))

  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTreeNodes = createTree(contentHeadings.map(d => ({ data: d })),
    (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));

  const questions = getAllLeafsWithAncestors({ data: {} as QuestionHtml, children: headingsTreeNodes }, (parent, child) => {
    //copy some children property bottom up from leafs to its parent
    if (parent.options?.length === 0 && child.options?.length > 0) {
      parent.options = child.options;
    }
  }).map(d => {

    const node = d;
    const rootAncestor = node.ancestors[1].data;

    //Heuristic - expect quiz question id as number
    const quizQuestionNumber = Math.floor(parseFloat(d.leaf.data.header.replaceAll("#", "")));

    //if there is a root parent of type SetextHeading1 - extract number range of quiz questions from header using regex search
    const range = rootAncestor.type?.name == Abbreviations.ST ? extractNumberRange(rootAncestor.header) : null;

    //include parent only if it is in range or it there is no such parent  
    const isInRange = range != null ? quizQuestionNumber >= range[0] && quizQuestionNumber <= range[1] : false;

    //const shouldIncludeRootParent = range != null ? isInRange : true;
    // if (isInRange) {
    //   console.log(d.leaf.data.id, node.ancestors[1].data.header, node.ancestors[1].data.content)
    // }
    //console.log(node.leaf.data.header, isInRange, range);
    const headerNode = node.ancestors[1].data;
    const headerEqualCount = countMaxChars(headerNode.header, "=");
    return {
      content: node.ancestors.slice(range == null ? 1 : 2).map(x => x.data.contentHtml).join(""),
      ...(isInRange && {
        header: {
          title: headerNode.header.replaceAll(/=+/g, ""),
          content: headerNode.contentHtml,
          mutliColumnLayout: headerEqualCount > 3 ? true : false
        }
      }),
      options: d.leaf.data.options?.length > 0 ? d.leaf.data.options : d.ancestors[d.ancestors.length - 2].data.options
    }
  });
  return questions;
}



test.each(examTestCases.filter(d => d.config.questions))(`generate sql queries $pathes`, async (exam) => {
  const questions = (await parseMarkdownTree(exam.pathes)).map(d => ({ ...d, id: uuidv4() }));
  const leafs = getAllLeafsWithAncestors(convertTree(exam.quiz));

  const quizId = uuidv4();
  const gamesSeed = sql`insert into public.quizes ${spreadInsert<NewQuizRecord>(
    {
      id: quizId,
      code: exam.quiz.metadata?.info?.code,      
      name: `${subjectLabel(exam.pathes[0] as SubjectType)} ${gradeLabel(exam.pathes[1] as GradeType)} ${exam.pathes[2].split('-')[1]}`,
    }
  )};`

  const filteredQuestion = questions.map((d, index) => ({
    ...d,
    metadata: leafs[index].leaf.data.node as AnswerMetadata<any>
  })).filter(d => d.metadata.verifyBy.kind == 'equalOption')

  const questionSeed = sql`insert into public.questions ${spreadInsert<NewQuestionRecord>(...filteredQuestion.map((d, index) => ({
    id: d.id,
    body: d.header != null ? d.header.title + d.header.content + d.content : d.content,
    order: index,
    quiz_id: quizId,
  })))};`

  const choices = sql`insert into public.choices ${spreadInsert<NewChoiceRecord>(...filteredQuestion.flatMap(d => (d.options?.length > 0 ? d.options : [
    { name: 'Ano', value: true }, { name: 'Ne', value: false }])
    .map(opt => {
      const verifyBy = d.metadata?.verifyBy
      
      return {
        question_id: d.id,
        body: opt.name,
        is_correct: getVerifyFunction(verifyBy)(opt as any) == null
      }
    })))};`

  const finalSqlQuery = replaceValues(gamesSeed) + "\n\n" +
    replaceValues(questionSeed) + "\n\n" +
    replaceValues(choices) + "\n\n";
  
  const ostmpdir = os.tmpdir();
  const tmpdir = path.join(ostmpdir, "generated");
  await fs.mkdir(tmpdir, { recursive:true });
  const file = path.join(tmpdir, `${exam.quiz.metadata?.info?.code}.sql`);
  await fs.writeFile(file, finalSqlQuery);
})



async function writeToFile(fileName:string, text: string){
  const ostmpdir = os.tmpdir();
  const tmpdir = path.join(ostmpdir, "generated");
  await fs.mkdir(tmpdir, { recursive:true });
  const file = path.join(tmpdir, fileName);
  await fs.writeFile(file, text);
}

test.each(examTestCases.filter(d => d.config.questions))(`generate sql queries $pathes`, async (exam) => {
  const textContent = await loadMarkdownWithAbsoluteImagesUrl(exam.pathes);
  await writeToFile(`${exam.pathes[2]}.md`, textContent);  
})
