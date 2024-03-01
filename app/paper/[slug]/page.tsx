import Navigation from '@/components/Navigation'
import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { absoluteUrl, cls } from '@/lib/utils/utils'
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
  const { project, contentHeadings } = await getData(params);

  return (
    <Layout headerNavigation={<Navigation name={project.title} />} fullWidth={true}>
      <div className='paper' data-testid="root-document">
        <div className='columns-sm [column-rule-style:solid] [column-rule-width:1px] [column-rule-color:lightgray]'>
          {contentHeadings.map((d, i, arr) => <div className={cls(['break-inside-avoid print:break-inside-avoid px-2',
          (d.type?.name == Abbreviations.ST || d.type?.name == Abbreviations.H1) && i !== 0 && 'mt-5'
          ])} key={i} data-testid={`question-${i}`}>

            <div 
              className={cls([
                "prose lg:prose-xl",
                d.hasTexIndent && d.multiColumnsCount <= 1 && "[&_blockquote_p]:indent-2 [&_blockquote]:text-justify",
                d.multiColumnsCount > 1 && "[&_blockquote]:sm:columns-2"
              ])}
              dangerouslySetInnerHTML={{ __html: d.contentHtml }}
            />
            {d.options.map((d, i) => <div className='flex gap-1' key={`opt-${i}`}>
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

  const mdParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);
  const parsedTree = mdParser.parse(quizContent);
  const headings = chunkHeadingsList(parsedTree, quizContent);

  const contentHeadings = await Promise.all(headings.map(async (d) => ({
    ...d,
    options: d.options.length > 0 ? await Promise.all(d.options.map(async opt => ({
      ...opt,
      name: await markdownToHtml(opt.name)
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
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}