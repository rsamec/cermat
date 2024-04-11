import Navigation from '@/components/Navigation'

import { getDocumentSlugs, getDocuments, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { Maybe, imageUrl, extractNumberRange } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import { parser, GFM, Superscript, Subscript } from "@lezer/markdown";
import { Abbreviations, OptionList, QuestionHtml, ShortCodeMarker, chunkHeadingsList, countMaxChars } from '@/lib/utils/parser.utils'
import { createTree, getAllLeafsWithAncestors } from '@/lib/utils/tree.utils'
import Wizard from '@/components/wizard/wizard'
import { loadJson, loadMarkdown } from '@/lib/utils/file.utils'
import { Question } from '@/lib/models/wizard'
import { AnswerGroup, AnswerMetadataTreeNode, convertTree } from '@/lib/utils/quiz-specification'
import Layout from '@/components/Layout'
import { ExamMetadata } from '@/components/utils/exam'

const collection = 'exams';
type Project = {
  tags: { value: string; label: string }[],

} & OstDocument & ExamMetadata

interface Params {
  params: {
    slug: string
  }
}
export async function generateMetadata(params: Params): Promise<Metadata> {
  const { project } = await getData(params)

  if (!project) {
    return {}
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      url: imageUrl(`/${collection}/${project.slug}`),
      images: [
        {
          url: imageUrl(project?.coverImage || '/images/og-image.png'),
          width: 1200,
          height: 630,
          alt: project.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: imageUrl(project?.coverImage || '/images/og-image.png')
    }
  }
}

export default async function WizardPage(params: Params) {
  const { project, questions, tree, assetPath } = await getData(params);

  return (
    <Layout headerNavigation={<Navigation name={project.title} />}>
      <Wizard steps={questions} tree={tree} assetPath={assetPath}></Wizard>
    </Layout>)
}

async function getData({ params }: Params) {
  const db = await load()
  const project = await db
    .find<Project>({ collection: collection, slug: params.slug }, [
      'title',
      'publishedAt',
      'description',
      'slug',
      'author',
      'content',
      'coverImage',
      'subject',
      'grade',
      'code'
    ])
    .first();

  const assetPath = [project.subject, project.grade, project.code]
  const quizContent = await loadMarkdown(assetPath.concat(['index.md']));

  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);

  const headings = chunkHeadingsList(parsedTree, quizContent);

  const contentHeadings = await Promise.all(headings.map(async (d) => ({
    ...d,
    options: d.options.length > 0 ? await Promise.all(d.options.map(async opt => ({
      ...opt,
      nameHtml: await markdownToHtml(opt.name, { path: assetPath })
    }))) : d.options,
    contentHtml: d.type?.name == Abbreviations.ST ? await markdownToHtml(d.content, { path: assetPath }) : (await markdownToHtml(d.header, { path: assetPath }) + await markdownToHtml(d.content, { path: assetPath })),
  })))

  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTreeNodes = createTree(contentHeadings.map(d => ({ data: d })), (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));
  const leafs = getAllLeafsWithAncestors({ data: {} as QuestionHtml, children: headingsTreeNodes }, (parent, child) => {
    //copy some children property bottom up from leafs to its parent
    if (parent.options?.length === 0 && child.options?.length > 0) {
      parent.options = child.options;
    }
  });


  //const contentTree = renderHtmlTree(parsedTree)

  const quiz: AnswerGroup<any> = await loadJson([`${project.code}.json`]);

  const quizTree = convertTree(quiz);
  const subject = project.subject;
  const quizQuestions = getAllLeafsWithAncestors(quizTree).map((d, i) => {

    const node = leafs[i];
    
    //console.log(leafs.length,i, d.leaf.data.id)
    const rootAncestor = node.ancestors[1].data;
    
    const parts = d.leaf.data.id.split('.');

    //Heuristic - expect quiz question id as number
    const quizQuestionNumber = Math.floor(parseFloat((subject == "math" || subject == "cz") ? parts[0]: parts[1]));
    //if there is a root parent of type SetextHeading1 - extract number range of quiz questions from header using regex search
    const range = rootAncestor.type?.name == Abbreviations.ST ? extractNumberRange(rootAncestor.header) : null;
    //include parent only if it is in range or it there is no such parent  
    const isInRange = range != null ? quizQuestionNumber >= range[0] && quizQuestionNumber <= range[1] : false;
    //const shouldIncludeRootParent = range != null ? isInRange : true;
    // if (isInRange) {
    //   console.log(d.leaf.data.id, node.ancestors[1].data.header, node.ancestors[1].data.content)
    // }
    //console.log(node.leaf.data.header, isInRange, range, quizQuestionNumber);
    const treeLeaf = d.leaf.data as AnswerMetadataTreeNode<any>
    const headerNode = node.ancestors[1].data;
    const headerEqualCount = countMaxChars(headerNode.header, "=");

    return {
      id: treeLeaf.id,
      metadata: treeLeaf.node,
      data: {
        rawContent: node.ancestors.slice(range == null ? 1 : 2).map(x => x.data.header + x.data.content).join(""),
        content: node.ancestors.slice(range == null ? 1 : 2).map(x => x.data.contentHtml).join(""),
        ...(isInRange && {
          header: {
            title: headerNode.header.replaceAll(/=+/g, ""),
            rawTitle: headerNode.header,
            content: headerNode.contentHtml,
            rawContent: headerNode.content,
            mutliColumnLayout: headerEqualCount > 3 ? true : false
          }
        }),
        options: node.leaf.data.options?.length > 0 ? node.leaf.data.options : node.ancestors[node.ancestors.length - 2].data.options
      }
    } as Question
  })
  
  return {
    project,
    assetPath,
    questions: quizQuestions,
    tree: quizTree,
  }
}

export async function generateStaticParams() {
  return getDocuments(collection, ['slug'])  
  // const posts = getDocumentSlugs(collection)
  // return posts.map((slug) => ({ slug }))
}