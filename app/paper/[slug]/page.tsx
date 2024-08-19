import Navigation from '@/components/Navigation'
import { getDocumentSlugs, getDocuments, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { imageUrl, cls } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import { loadMarkdown } from '@/lib/utils/file.utils'
import { GFM, Subscript, Superscript, parser } from '@lezer/markdown'
import { ShortCodeMarker, OptionList, chunkHeadingsList, Abbreviations, countMaxChars } from '@/lib/utils/parser.utils'
import Layout from '@/components/Layout'
import { ExamMetadata } from '@/components/utils/exam'

const collection = 'exams';
type Project = {
  tags: { value: string; label: string }[]
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

export default async function Exam(params: Params) {
  const { project, contentHeadings } = await getData(params);

  return (
    <Layout headerNavigation={<Navigation name={project.title} />} fullWidth={true}>
      <div className='paper' data-testid="root-document">
        <div className='hidden print:block border-b-4 border-black dark:border-white p-1 text-3xl text-bold text-center mb-5'>{project.title}</div>
        <div className='columns-sm print:columns-sm [column-rule-style:solid] [column-rule-width:1px] [column-rule-color:lightgray]'>
          {contentHeadings.map((d, i, arr) => <div className={cls(
            ['break-inside-avoid print:break-inside-avoid px-2',
            (d.type?.name == Abbreviations.ST || d.type?.name == Abbreviations.H1) && i !== 0 && 'my-5',
            d.type?.name == Abbreviations.H1 && '[&_h1>span:first-of-type]:text-6xl [&_h1>span:first-of-type]:font-bold [&_h1>span:first-of-type]:mr-3 [&_h1>span:first-of-type]:float-left',
            d.type?.name == Abbreviations.H1 && i!==0 && 'mt-10', // [&_h1]:border-t [&_h1]:border-slate-300',
            d.type?.name == Abbreviations.ST  && i !== 0 && '[&_h1]:mt-8',
            d.type?.name == Abbreviations.ST  && '[&_h1]:text-center [&_h1]:mb-2 [&_h1]:before:block [&_h1]:before:border-t-2 [&_h1]:before:border-black [&_h1]:before:dark:border-white [&_h1]:after:block [&_h1]:after:border-t-2 [&_h1]:after:border-black [&_h1]:after:dark:border-white'
          ])} key={i} data-testid={`question-${i}`}>

            <div
              className={cls([
                "prose lg:prose-xl clear-both",
                "[&_h1+p:first-of-type]:my-2",
                d.hasTexIndent && d.multiColumnsCount <= 1 && "[&_blockquote_p]:indent-5 [&_blockquote]:text-justify",
                //d.hasTexIndent && d.multiColumnsCount <= 1 && "[&_blockquote_p:first-of-type]:indent-0 [&_blockquote_p:first-of-type]:first-letter:text-6xl [&_blockquote_p:first-of-type]:first-letter:font-bold [&_blockquote_p:first-of-type]:first-letter:mr-3 [&_blockquote_p:first-of-type]:first-letter:float-left",
                d.multiColumnsCount > 1 && "[&_blockquote]:sm:columns-2"
              ])}
              dangerouslySetInnerHTML={{ __html: d.contentHtml }}
            />
            {d.options.map((d, i) => <div className='flex gap-1 clear-both' key={`opt-${i}`}>
              <span>{d.value})</span>
              <div
                className="prose lg:prose-2xl"
                dangerouslySetInnerHTML={{ __html: d.name }}
              />
            </div>)
            }
          </div>
          )}
        </div>
      </div>
    </Layout>

  )
}

async function getData({ params }: Params) {
  const db = await load()
  const project = await db
    .find<Project>({ collection: collection, status: 'published', slug: params.slug }, [
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

  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);
  const headings = chunkHeadingsList(parsedTree, quizContent);

  const contentHeadings = await Promise.all(headings.map(async (d) => ({
    ...d,
    options: d.options.length > 0 ? await Promise.all(d.options.map(async opt => ({
      ...opt,
      name: await markdownToHtml(opt.name, { path: pathes })
    }))) : d.options,
    hasTexIndent: countMaxChars(d.header, "=") === 4,
    multiColumnsCount: Math.max(0, countMaxChars(d.header, "=") - 4),
    contentHtml: (await markdownToHtml(d.header, { path: pathes }) + await markdownToHtml(d.content, { path: pathes })),
  })))

  return {
    project,
    contentHeadings
  }
}

export async function generateStaticParams() {
  return getDocuments(collection, ['slug'])
  // const posts = getDocumentSlugs(collection)
  // return posts.map((slug) => ({ slug }))
}