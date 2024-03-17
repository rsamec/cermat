import Layout from '../components/Layout'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '@/lib/utils/markdown';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/search/search-form';
import { toTags } from '@/components/utils/exam';
import Image from 'next/image';
import StatsCard from '@/components/StatsCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookAtlas, faGlobe, faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import coverImage from '../public/images/000000.png'

const collection = "exams";

export default async function Index() {
  const { content, mathPosts, primaryLanguagePosts } = await getData()
  return (
    <Layout headerNavigation={<Navigation />} showContact={true} fullWidth={false}>
      <div className='flex flex-col gap-6'>
        <section>
          <div className='origin-center'>
            <Image
              alt='Online cermat testy'
              src={coverImage}
              className="origin-center object-cover object-center w-full h-auto"
              sizes="100vw"
              priority
            />
          </div>
        </section>

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
          <h3 className='mb-8 text-3xl font-bold'>Vyhledat</h3>
          <SearchForm></SearchForm>
        </section>
        <section>
          <h3 className='mb-8 text-3xl font-bold'>Online testy</h3>
          <div className="flex flex-wrap gap-10">
            <Link href={`/timeline/math`}>
              <StatsCard value={mathPosts.length} text="matika" icon={<FontAwesomeIcon icon={faSquareRootVariable} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
            <Link href={`/timeline/cz`}>
              <StatsCard value={primaryLanguagePosts.length} text="čeština" icon={<FontAwesomeIcon icon={faBookAtlas} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
            <Link href={`/timeline/en`}>
              <StatsCard value={0} text="angličtina" icon={<FontAwesomeIcon icon={faGlobe} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
          </div>
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
    .find({ collection, subject: 'math', status:'published' }, [
      'title',
      'publishedAt',
      'slug',
      'coverImage',
      'description',
      'status',
      'subject',
      'year',
      'grade',
      'code',
    ])
    .sort({ slug: 1 })
    .toArray()

  const primaryLanguagePosts = await db
    .find({ collection, subject: 'cz', status:'published' }, [
      'title',
      'publishedAt',
      'slug',
      'coverImage',
      'description',
      'status',
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

  const toItems = (items: any[]) => items.map(d => ({ ...d, tags: toTags(d, ['year', 'grade']) }))

  return {
    content,
    mathPosts: toItems(mathPosts),
    primaryLanguagePosts: toItems(primaryLanguagePosts),
  }
}