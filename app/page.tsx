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
  const { content, mathPosts, czPosts, enPosts, dePosts, frPosts } = await getData()
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
              <StatsCard value={czPosts.length} text="čeština" icon={<FontAwesomeIcon icon={faBookAtlas} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
            <Link href={`/timeline/en`}>
              <StatsCard value={enPosts.length} text="angličtina" icon={<FontAwesomeIcon icon={faGlobe} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
            <Link href={`/timeline/de`}>
              <StatsCard value={dePosts.length} text="němčina" icon={<FontAwesomeIcon icon={faGlobe} size='2x' ></FontAwesomeIcon>}></StatsCard>
            </Link>
            <Link href={`/timeline/fr`}>
              <StatsCard value={frPosts.length} text="francouzština" icon={<FontAwesomeIcon icon={faGlobe} size='2x' ></FontAwesomeIcon>}></StatsCard>
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
        {czPosts.length > 0 && (
          <ContentGrid
            title="Čeština"
            items={czPosts}
            collection={collection}
            iconType="cz"
            priority
          />
        )}
        {enPosts.length > 0 && (
          <ContentGrid
            title="Angličtina"
            items={enPosts}
            collection={collection}
            iconType="en"
            priority
          />
        )}
        {dePosts.length > 0 && (
          <ContentGrid
            title="Němčina"
            items={dePosts}
            collection={collection}
            iconType="en"
            priority
          />
        )}
        {frPosts.length > 0 && (
          <ContentGrid
            title="Francouzština"
            items={frPosts}
            collection={collection}
            iconType="en"
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
  const fieldsSet = [
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
  ]
  const mathPosts = await db
    .find({ collection, subject: 'math', status: 'published' }, fieldsSet)
    .sort({ slug: 1 })
    .toArray()

  const czPosts = await db
    .find({ collection, subject: 'cz', status: 'published' }, fieldsSet)
    .sort({ slug: 1 })
    .toArray()

  const enPosts = await db
    .find({ collection, subject: 'en', status: 'published' }, fieldsSet)
    .sort({ slug: 1 })
    .toArray()

  const dePosts = await db
    .find({ collection, subject: 'de', status: 'published' }, fieldsSet)
    .sort({ slug: 1 })
    .toArray()

  const frPosts = await db
    .find({ collection, subject: 'fr', status: 'published' }, fieldsSet)
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
    czPosts: toItems(czPosts),
    enPosts: toItems(enPosts),
    dePosts: toItems(dePosts),
    frPosts: toItems(frPosts),
  }
}