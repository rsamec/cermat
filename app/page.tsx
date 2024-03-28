import Layout from '../components/Layout'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '@/lib/utils/markdown';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/search/search-form';
import { SubjectType, subjectLabel, toTags } from '@/components/utils/exam';
import Image from 'next/image';
import StatsCard from '@/components/StatsCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import coverImage from '../public/images/000000.png'

const collection = "exams";

export default async function Index() {
  const { content, categories } = await getData();

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
          <div className="flex flex-wrap gap-8">
            {categories.map(post =>
              <Link key={post.code} href={`/timeline/${post.code}`}>
                <StatsCard value={post.total} text={subjectLabel(post.code)} icon={<FontAwesomeIcon icon={post.code == "math" ? faSquareRootVariable : faGlobe} size='2x' ></FontAwesomeIcon>}></StatsCard>
              </Link>
            )}
          </div>
        </section>
        {categories.map(post => {
          return post.items.length > 0 ? <ContentGrid key={post.code}
            title={subjectLabel(post.code)}
            items={post.items}
            subject={post.code}
            viewAll={post.total > post.items.length}
            priority
          /> : null
        })
        }
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
    .sort({ publishedAt: -1 })
    .toArray()

  const czPosts = await db
    .find({ collection, subject: 'cz', status: 'published' }, fieldsSet)
    .sort({ publishedAt: -1 })
    .toArray()

  const enPosts = await db
    .find({ collection, subject: 'en', status: 'published' }, fieldsSet)
    .sort({ publishedAt: -1 })
    .toArray()

  const dePosts = await db
    .find({ collection, subject: 'de', status: 'published' }, fieldsSet)
    .sort({ publishedAt: -1 })
    .toArray()

  const frPosts = await db
    .find({ collection, subject: 'fr', status: 'published' }, fieldsSet)
    .sort({ publishedAt: -1 })
    .toArray()


  // const allProjects = await db
  //   .find({ collection: 'projects' }, ['title', 'slug', 'coverImage'])
  //   .sort({ publishedAt: -1 })
  //   .toArray()

  const limit = 4;
  const toItems = (code: SubjectType, items: any[]) => ({
    code,
    total: items.length,
    items: items.slice(0, limit).map(d => ({ ...d, tags: toTags(d, ['year', 'grade']) }))
  });


  return {
    content,
    categories: [
      toItems("math", mathPosts),
      toItems("cz", czPosts),
      toItems("en", enPosts),
      toItems("de", dePosts),
      toItems("fr", frPosts)]
  }
}