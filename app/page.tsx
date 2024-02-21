import Layout from '../components/Layout'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '@/lib/utils/markdown';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/search/search-form';
import { toTags } from '@/components/utils/exam';

const collection = "exams";

export default async function Index() {
  const { content, mathPosts, primaryLanguagePosts } = await getData()  
  return (
    <Layout headerNavigation={<Navigation />} showContact={true}>
      <div className='flex flex-col gap-4'>
        

        <section>
          <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
            Mimooficiální cermat testy
          </h2>
          <div
            className="prose lg:prose-2xl home-intro"
            dangerouslySetInnerHTML={{ __html: content }}
          />          
        </section>
        <section>
          <SearchForm></SearchForm>
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
      'code',
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
      'code',
    ])
    .sort({ slug: 1 })
    .toArray()




  // const allProjects = await db
  //   .find({ collection: 'projects' }, ['title', 'slug', 'coverImage'])
  //   .sort({ publishedAt: -1 })
  //   .toArray()

  const toItems = (items: any[]) => items.map(d => ({...d, tags: toTags(d, ['year','grade'])}))

  return {
    content,
    mathPosts: toItems(mathPosts),
    primaryLanguagePosts: toItems(primaryLanguagePosts),
  }
}