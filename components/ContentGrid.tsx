import type { OstDocument } from 'outstatic'
import Link from 'next/link'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareRootVariable, faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { imageUrl, isEmptyOrWhiteSpace } from '@/lib/utils/utils';
import { SubjectType } from './utils/exam';


type Item = {
  tags?: { value: string; label: string }[]
} & OstDocument

type Props = {
  subject: SubjectType
  title?: string
  items: Item[]
  priority?: boolean
  viewAll?: boolean
}

const ContentGrid = ({
  title = 'More',
  items,
  subject,
  priority = false,
  viewAll = true
}: Props) => {
  return (
    <section id={subject}>
      <div className="flex gap-4 md:gap-6 items-end">
        <h2 className="text-3xl font-bold tracking-tighter leading-tight capitalize dark:text-white">
          {title}
        </h2>
        {viewAll ? (
          <Link href={`/timeline/${subject}`} className="pb-1">
            View all <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-6">
        {items.map((item, id) => (
          <div key={id} className='max-w-64 flex flex-col gap-2'>


            <div key={item.slug} className="p-1 cursor-pointer border project-card rounded-md md:w-full scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 hover:shadow overflow-hidden dark:border-gray-700">

              {(
                <div className='h-full flex flex-col gap-2'>
                  <Link className="grow flex flex-col gap-2" href={`/wizard/${item.slug}`}>
                    <div className='relative'>
                      {/* <div className='absolute right-2 top-2'>
                        {Array.isArray(item?.tags)
                          ? item.tags.map(({ label }) => (
                            <span
                              key={label}
                              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                            >
                              {label}
                            </span>
                          ))
                          : null}
                      </div> */}
                      <Image
                        alt={item.title}
                        src={imageUrl(!isEmptyOrWhiteSpace(item?.coverImage!) ? item?.coverImage! : `/${[item.subject, item.grade, item.code, 'cover.png'].join("/")}`)}
                        width={0}
                        height={0}
                        className="object-cover object-center w-full h-auto"
                        sizes="(min-width: 768px) 347px, 192px"
                        priority
                      />
                    </div>
                  </Link>

                </div>
              )}
            </div>
            <div>
              <div className="flex gap-2 items-start">
                {subject == "math" && <FontAwesomeIcon icon={faSquareRootVariable} size='2x' ></FontAwesomeIcon>}
                {subject == "cz" && <FontAwesomeIcon icon={faGlobe} size='2x' ></FontAwesomeIcon>}
                <Link className="grow flex flex-col gap-2" href={`/prospect/${item.slug}`}>
                  <h4 className="text mb-2 leading-snug font-bold hover:underline">
                    {item.title}
                  </h4>
                </Link>


              </div>
              {/* <p className="text-sm leading-relaxed mb-4">
                {item.description}
              </p> */}
            </div>
            {/* <div className='flex gap-4 justify-end'>

                <Link href={`/paper/${item.slug}`}>
                  <FontAwesomeIcon icon={faPrint} size='lg' ></FontAwesomeIcon>
                </Link>
                <Link href={`/sheet/${item.slug}`}>
                  <FontAwesomeIcon icon={faPenToSquare} size='lg' ></FontAwesomeIcon>
                </Link>
                <Link href={`/wizard/${item.slug}`}>
                  <FontAwesomeIcon icon={faWaveSquare} size='lg' ></FontAwesomeIcon>
                </Link>

            </div> */}
          </div>

        ))}
      </div>
    </section>
  )
}

export default ContentGrid