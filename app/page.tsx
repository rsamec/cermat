import Layout from '../components/Layout'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '@/lib/utils/markdown';

const collection = "exams";

export default async function Index() {
  const { content, mathPosts, primaryLanguagePosts } = await getData()

  return (
    <Layout>
      {/* <div className='hidden md:block relative h-72'>
        <Background></Background>
      </div> */}
      <div className="max-w-6xl mx-auto px-5">
        <section className="mt-16 mb-16 md:mb-12">
          <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
            Mimooficiální cermat testy
          </h2>
          <div
            className="prose lg:prose-2xl home-intro"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
        {mathPosts.length > 0 && (
          <ContentGrid
            title="Matika"
            items={mathPosts}
            collection={collection}
            iconType="math"
            priority
          />
        )}
        {primaryLanguagePosts.length > 0 && (
          <ContentGrid
            title="Čeština"
            items={primaryLanguagePosts}
            collection={collection}
            iconType="cz"
            priority
          />
        )}
        {/* {allProjects.length > 0 && (
          <ContentGrid
            title="Rady a tipy"
            items={allProjects}
            collection="projects"
          />
        )} */}
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: 'pages', slug: 'home', }, ['content'])
    .first()

  const content = await markdownToHtml(page.content)

  const mathPosts = await db
    .find({ collection, subject: 'math' }, [
      'title',
      'publishedAt',
      'slug',
      'coverImage',
      'description',
      'subject',
      'year',
      'grade',
      'timeSlot',
    ])
    .sort({ slug: 1 })
    .toArray()

  const primaryLanguagePosts = await db
    .find({ collection, subject: 'cz' }, [
      'title',
      'publishedAt',
      'slug',
      'coverImage',
      'description',
      'subject',
      'year',
      'grade',
      'timeSlot',
    ])
    .sort({ slug: 1 })
    .toArray()




  // const allProjects = await db
  //   .find({ collection: 'projects' }, ['title', 'slug', 'coverImage'])
  //   .sort({ publishedAt: -1 })
  //   .toArray()

  const timeSlots = new Map([[1, "1. řádný termín"], [2, "2. řádný termín"], [3, "1. náhradní termín"], [4, "2. náhradní termín"]])
  const toItems = (items: any[]) => items.map(d => ({
    ...d, tags: [
      { value: d.year, label: d.year },
      ...(d.grade ? [{ value: d.grade, label: d.grade }] : []),
      ...(d.timeSlot ? [{ value: d.timeSlot, label: timeSlots.get(d.timeSlot) ?? d.timeSlot }] : [])
    ]
  }))

  return {
    content,
    mathPosts: toItems(mathPosts),
    primaryLanguagePosts: toItems(primaryLanguagePosts),
  }
}