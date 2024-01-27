import Navigation from '@/components/Navigation'

import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
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
  const { project, content } = await getData(params);

  return (
    <>
      <Header><Navigation name={project.title} /></Header>
      <div className="max-w-6xl mx-auto px-5">
        <div
          className="prose lg:prose-2xl home-intro"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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



  const content = await markdownToHtml(project.content)

  return {
    project,
    content
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}