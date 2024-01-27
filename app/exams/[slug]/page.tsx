import Navigation from '@/components/Navigation'

import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { Maybe, absoluteUrl, extractNumberRange } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import { parser, GFM, Superscript, Subscript } from "@lezer/markdown";
import { Abbreviations, OptionList, QuestionHtml, ShortCodeMarker, chunkHeadingsList, countMaxChars } from '@/lib/utils/parser.utils'
import { createTree, getAllLeafsWithAncestors } from '@/lib/utils/tree.utils'
import Wizard from '@/components/wizard/wizard'
import { loadJsonBySlug } from '@/lib/utils/file.utils'
import { Question, QuestionGroup } from '@/lib/models/quiz'
import { AnswerGroup, AnswerMetadata, AnswerMetadataTreeNode, convertTree } from '@/lib/utils/quiz-specification'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const collection = 'exams';
type Project = {
  tags: { value: string; label: string }[]
} & OstDocument

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
      url: absoluteUrl(`/${collection}/${project.slug}`),
      images: [
        {
          url: absoluteUrl(project?.coverImage || '/images/og-image.png'),
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
      images: absoluteUrl(project?.coverImage || '/images/og-image.png')
    }
  }
}

export default async function Exam(params: Params) {
  const { project, questions, tree } = await getData(params);

  return (
    <>
      <Header><Navigation name={project.title} /></Header>
      <Wizard questions={questions} tree={tree}></Wizard>
      <Footer></Footer>
    </>
  )
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
      'coverImage'
    ])
    .first()



  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(project.content);

  const headings = chunkHeadingsList(parsedTree, project.content);

  const contentHeadings = await Promise.all(headings.map(async (d) => ({
    ...d,
    contentHtml: d.type?.name == Abbreviations.ST ? await markdownToHtml(d.content) : (await markdownToHtml(d.header) + await markdownToHtml(d.content)),
  })))

  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTreeNodes = createTree(contentHeadings.map(d => ({ data: d })), (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));
  const leafs = getAllLeafsWithAncestors({ data: {} as QuestionHtml, children: headingsTreeNodes }, (parent, child) => {
    //copy some children property donw up from leafs to it parent
    if (parent.options?.length === 0 && child.options?.length > 0) {
      parent.options = child.options;
    }
  });


  //const contentTree = renderHtmlTree(parsedTree)

  const quiz: AnswerGroup<any> = await loadJsonBySlug(params.slug);

  const quizTree = convertTree(quiz);
  const quizQuestions = getAllLeafsWithAncestors(quizTree).map((d, i) => {

    const node = leafs[i];
    const rootAncestor = node.ancestors[1].data;

    //Heuristic - expect quiz question id as number
    const quizQuestionNumber = Math.floor(parseFloat(d.leaf.data.id));
    //if there is a root parent of type SetextHeading1 - extract number range of quiz questions from header using regex search
    const range = rootAncestor.type?.name == Abbreviations.ST ? extractNumberRange(rootAncestor.header) : null;
    //include parent only if it is in range or it there is no such parent  
    const isInRange = range != null ? quizQuestionNumber >= range[0] && quizQuestionNumber <= range[1] : false;
    //const shouldIncludeRootParent = range != null ? isInRange : true;
    // if (isInRange) {
    //   console.log(d.leaf.data.id, node.ancestors[1].data.header, node.ancestors[1].data.content)
    // }
    //console.log(node.leaf.data.header, isInRange, range);
    const treeLeaf = d.leaf.data as AnswerMetadataTreeNode<any>
    const headerNode = node.ancestors[1].data;
    
    return {
      id: treeLeaf.id,
      metadata: treeLeaf.node,
      data: {
        content: node.ancestors.slice(range == null ? 1 : 2).map(x => x.data.contentHtml).join(""),
        ...(isInRange && {
          header: {
            title: headerNode.header.replaceAll(/=+/g, ""),
            content: headerNode.contentHtml,
            mutliColumnLayout: countMaxChars(headerNode.header, "=") > 3 ? true : false
          }
        }),
        options: node.leaf.data.options?.length > 0 ? node.leaf.data.options : node.ancestors[node.ancestors.length - 2].data.options
      }
    } as Question
  })


  

  // const moreProjects = await db
  //   .find({ collection, slug: { $ne: params.slug } }, [
  //     'title',
  //     'slug',
  //     'coverImage'
  //   ])
  //   .toArray()

  return {
    project,
    questions: quizQuestions,
    tree: quizTree,
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}