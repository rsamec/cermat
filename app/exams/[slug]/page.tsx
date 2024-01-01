import Navigation from '@/components/Navigation'
import Layout from '@/components/Layout'

import { getDocumentSlugs, load } from 'outstatic/server'
import DateFormatter from '@/components/DateFormatter'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import {parser, GFM, Superscript, Subscript} from "@lezer/markdown";
import { chunkByAbbreviationType } from '@/lib/utils/parser.utils'
import Counter from '@/app/counter'

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
  const { project, moreProjects, content, contentChunks } = await getData(params)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Navigation />
        <article className="mb-8">
          <div>
            <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
              {project.title}
            </h1>
            <div className="hidden md:block md:mb-8 italic text-slate-400">
              Publikováno <DateFormatter dateString={project.publishedAt} />
              {' '}
              {project?.author?.name ? `by ${project?.author?.name}` : null}.
            </div>
            {/* <Counter contentChunks={contentChunks} ></Counter> */}
            
            {/* <div className="inline-block p-4 border mb-8 font-semibold text-lg rounded shadow">
                {project.description}
              </div> */}
            <div className="max-w-2xl mx-auto">
              <div
                className="prose lg:prose-xl flex flex-col space-y-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            
          </div>
        </article>     
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
      'coverImage'
    ])
    .first()

  
  
  const mdParser = parser.configure([GFM, Subscript, Superscript]);  
  const chunks = chunkByAbbreviationType(mdParser.parse(project.content),project.content, "HR");
  
  const contentChunks = await Promise.all(chunks.map(async (d)=> {
    return await markdownToHtml(d);  
  }))
  console.log(chunks.length);
    
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
    contentChunks,
    moreProjects
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}