import Navigation from '@/components/Navigation'

import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { Maybe, absoluteUrl } from '@/lib/utils/utils'
import { AnswerGroup, convertTree } from '@/lib/utils/quiz-specification'
import { loadJson, loadMarkdown } from '@/lib/utils/file.utils'
import { GFM, Subscript, Superscript, parser } from '@lezer/markdown'
import { ShortCodeMarker, OptionList, chunkHeadingsList, Abbreviations, ParsedQuestion } from '@/lib/utils/parser.utils'
import { createTree, getAllLeafsWithAncestors } from '@/lib/utils/tree.utils'
import Layout from '@/components/Layout'
import QuizSheet from '@/components/quiz/quiz-sheet'

const collection = 'exams';
type Project = {
  tags: { value: string; label: string }[]
} & OstDocument & ExamMetadata


type ExamMetadata = {
  subject: 'cz' | 'math'
  grade: '4' | '6' | '8' | 'diploma'
  code: string
}

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

export default async function Sheet(params: Params) {
  const { project, quizTree, questions } = await getData(params);

  return (
    <Layout headerNavigation={<Navigation name={project.title} />}>
        <QuizSheet tree={quizTree} headersAndOptions={questions}></QuizSheet>      
    </Layout>
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
      'coverImage',
      'subject',
      'grade',
      'code'
    ])
    .first()


  const pathes = [project.subject, project.grade, project.code]
  const quizContent = await loadMarkdown(pathes.concat(['index.md']));

  const quiz: AnswerGroup<any> = await loadJson([`${project.code}.json`]);

  const quizTree = convertTree(quiz);


  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);
  const headings = chunkHeadingsList(parsedTree, quizContent);


  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTreeNodes = createTree(headings.map(d => ({ data: d })), (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));
  const questions = getAllLeafsWithAncestors({ data: {} as ParsedQuestion, children: headingsTreeNodes }, (parent, child) => {
    //copy some children property bottom up from leafs to its parent
    if (parent.options?.length === 0 && child.options?.length > 0) {
      parent.options = child.options;
    }
  }).map(d => ({
    header: d.leaf.data.header,
    options: d.leaf.data.options?.length > 0 ? d.leaf.data.options : d.ancestors[d.ancestors.length - 2].data.options
  }));




  return {
    project,
    quizTree,
    questions
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}