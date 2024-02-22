import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { getDocumentSlugs, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils/utils'
import markdownToHtml from '@/lib/utils/markdown'
import DateFormatter from '@/components/DateFormatter'
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

export default async function Prospect(params: Params) {
  const { project, content } = await getData(params);

  return (
    <Layout headerNavigation={<Navigation name={project.title} />}>

      <article>
        {/* <div className="relative mb-2 w-full aspect-[4/3]">
            <Image
              alt={project.title}
              src={imageUrl(!isEmptyOrWhiteSpace(project?.coverImage!) ? project?.coverImage! : `/${[project.subject, project.grade, project.code, 'cover.png'].join("/")}`)}
              fill
              className="object-contain object-center"
              priority
            />
          </div> */}
        {Array.isArray(project?.tags)
          ? project.tags.map(({ label }) => (
            <span
              key="label"
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {label}
            </span>
          ))
          : null}
        <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
          {project.title}
        </h1>
        <div className="hidden md:block md:mb-12 text-slate-600">
          Written on <DateFormatter dateString={project.publishedAt} /> by{' '}
          {project?.author?.name || ''}.
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>

          <div className="card">
            <div className="flex flex-col justify-between leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Kompaktní zadání</h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Zobraz si kompaktní zadání a pracuj s tužkou a papírem.<br/>
                Výsledky zapiš do formuláře s možností vyhodnocení testu.</p>
              <div className='flex flex-wrap gap-3'>
                <Link href={`/paper/${project.slug}`}>
                  <button className='btn btn-blue flex items-center'>Zobrazit
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </button>
                </Link>
                <Link href={`/sheet/${project.slug}`}>
                  <button className='btn btn-blue flex items-center'>Formulář
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-col justify-between leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Krok po kroku</h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Trénuj pomocí průvodce, který tě provede vyplňením testu po jednotlivých otázkách.</p>
              <Link href={`/wizard/${project.slug}`}><button className='btn btn-blue'>Start</button></Link>

            </div>
          </div>

          <div className="card">
            <div className="flex flex-col justify-between leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Originální zadání</h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Vytiskni si plné verze zadání.</p>
              <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                <li>
                  <a href="#" className="text-gray-500 dark:text-gray-400">Testové zadání</a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 dark:text-gray-400">Klíč správných řešení</a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 dark:text-gray-400">Záznamový arch</a>
                </li>
              </ul>

            </div>
          </div>
        </div>

        <hr className="border-neutral-200 mt-10 mb-10" />


        <div className="max-w-2xl mx-auto">
          <div
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
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

  const content = await markdownToHtml(project.content)

  return {
    project,
    content,
  }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs(collection)
  return posts.map((slug) => ({ slug }))
}