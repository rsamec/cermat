import Navigation from '@/components/Navigation'
import { getDocuments, load } from 'outstatic/server'
import { OstDocument } from 'outstatic'
import Layout from '@/components/Layout'
import ContentGrid from '@/components/ContentGrid';
import { ExamMetadata, GradeType, SubjectType, toTags } from '@/components/utils/exam';
import NothingThere from '@/components/NothingThere';
import Timeline from '@/components/Timeline';

const collection = 'exams';
type Exam = {
  tags: { value: string; label: string }[]
} & OstDocument & ExamMetadata

type ExamSearchMetadata = { search: [SubjectType, GradeType] };

interface Params {
  params: ExamSearchMetadata
}

// export async function generateMetadata(params: Params): Promise<Metadata> {
//   const { exams } = await getData(params)

//   if (!exam) {
//     return {}
//   }

//   return {
//     title: exam.title,
//     description: exam.description,
//     openGraph: {
//       title: exam.title,
//       description: exam.description,
//       type: 'article',
//       url: absoluteUrl(`/${collection}/${exam.slug}`),
//       images: [
//         {
//           url: absoluteUrl(exam?.coverImage || '/images/og-image.png'),
//           width: 1200,
//           height: 630,
//           alt: exam.title
//         }
//       ]
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: exam.title,
//       description: exam.description,
//       images: absoluteUrl(exam?.coverImage || '/images/og-image.png')
//     }
//   }
// }

export default async function TimelinePage({ params }: Params) {
  const { exams } = await getData({ params });
  const tags = toTags({ subject: params.search[0], grade: params.search[1] }, ['subject', 'grade']);
  return (
    <Layout headerNavigation={<Navigation name={`${tags.map(d => d.label).join(", ")}`} />} >
      {exams.length > 0 ? (
        <Timeline items={exams.map(d => ({
          text: d.title,
          slug: d.slug,
          publishedAt: d.testedAt ?? new Date(parseInt(d.year, 10), 3,1).toISOString(),
          description: d.description,
        }))}></Timeline>
      ) : <NothingThere></NothingThere>}
    </Layout>
  )
}

async function getData({ params }: Params) {
  const db = await load()
  const exams = await db
    .find<Exam>({ collection, subject: params.search[0], ...(params.search[1] != null && { grade: params.search[1]}) }, [
      'title',
      'publishedAt',
      'testedAt',
      'description',
      'slug',
      'author',
      'content',
      'coverImage',
      'subject',
      'grade',
      'code',
      'year'
    ])
    .sort({ testedAt: 1 })
    .toArray()


  const toItems = (items: Exam[]) => items.map(d => ({ ...d, tags: toTags(d, ['subject', 'grade', 'year']) }))
  return {
    exams: toItems(exams),
  }
}

export async function generateStaticParams() {
  const posts = getDocuments(collection, ['subject', 'grade'])
  return posts.map(({ subject, grade }) => ({ search: [subject, grade] }))
}