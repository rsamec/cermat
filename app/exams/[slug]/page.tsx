import Navigation from '@/components/Navigation'

import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { Maybe, absoluteUrl, extractNumberRange } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import { parser, GFM, Superscript, Subscript } from "@lezer/markdown";
import { Abbreviations, OptionList, QuestionHtml, ShortCodeMarker, chunkHeadingsList } from '@/lib/utils/parser.utils'
import { createTree, getAllLeafsWithAncestors } from '@/lib/utils/tree.utils'
import Wizard from '@/components/wizard/wizard'
import { loadJsonBySlug } from '@/lib/utils/file.utils'
import { Question, QuestionGroup } from '@/lib/models/quiz'
import { AnswerGroup, convertTree } from '@/lib/utils/quiz-specification'
import Footer from '@/components/Footer'

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
  const { project, moreProjects, content, questions, tree } = await getData(params);


  //const steps = config.getAllLeafNodes();


  // const dynamicForm = dynamic(() => import(`../../../lib/exams/${project.slug}`), {
  //   ssr: false,
  // })

  // console.log(dynamicForm);


  return (
    <>
      <header className="bg-black text-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 p-2">
          <div className="flex">
            <Navigation name={project.title} />
          </div>
        </div>
      </header>

      <div className="min-h-screen">
        <main>
          <div className="max-w-6xl mx-auto px-3 py-2">


            <article className="mb-8">
              <div>
                {/* <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
              {project.title}
            </h1> */}
                {/* <div className="hidden md:block md:mb-8 italic text-slate-400">
              Publikováno <DateFormatter dateString={project.publishedAt} />
              {' '}
              {project?.author?.name ? `by ${project?.author?.name}` : null}.
            </div> */}

                <Wizard questions={questions} tree={tree}></Wizard>
                {/* <div className="inline-block p-4 border mb-8 font-semibold text-lg rounded shadow">
                {project.description}
              </div> */}
                {/* <div>
              {
                steps.map((d, i) => {
                  const matchedLeaf = leafs[i];
                  const output = matchedLeaf.ancestors.map(d => d.data.contentHtml!).join("");


                  // return (<Step slug={project.slug} options={[]} ></Step>)
                  return (<div key={i}>
                    <div className="prose lg:prose-xl flex flex-col space-y-2"
                      dangerouslySetInnerHTML={{ __html: output }} />                    
                  </div>
                  )
                })}
            </div> */}


                {/* <div className="max-w-2xl mx-auto">
              <div
                className="prose lg:prose-xl flex flex-col space-y-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div> */}


              </div>
            </article>
          </div >
        </main>
      </div>
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

  const quiz: AnswerGroup<Question | QuestionGroup> = await loadJsonBySlug(params.slug);

  const quizTree = convertTree<QuestionGroup | Question>(quiz);
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
    //console.log(node.leaf.data.content);
    return {
      ...d.leaf.data,
      data: {
        content: node.ancestors.slice(range == null ? 1 : 2).map(x => x.data.contentHtml).join(""),
        ...(isInRange && {
          header: {
            title: node.ancestors[1].data.header.replace("===", ""),
            content: node.ancestors[1].data.contentHtml,
          }
        }),
        options: node.leaf.data.options?.length > 0 ? node.leaf.data.options : node.ancestors[node.ancestors.length - 2].data.options
      }
    } as Question
  })


  //console.log( headings.map(d => d.type?.name))
  //console.log(headings.map(d => d.type?.name + ":" + (d.header != "" ? d.header : d.nextHeader) + ":" + (/./.test(d.content))))

  // const contentChunks = await Promise.all(questions.map(async (d) => {
  //   return await markdownToHtml(d);
  // }))

  const content = await markdownToHtml(project.content)

  const moreProjects = await db
    .find({ collection, slug: { $ne: params.slug } }, [
      'title',
      'slug',
      'coverImage'
    ])
    .toArray()

  return {
    project,
    content,
    questions: quizQuestions,
    tree: quizTree,
    moreProjects
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}