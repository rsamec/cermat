import type { OstDocument } from 'outstatic'
import Link from 'next/link'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookAtlas, faWaveSquare, faSquareRootVariable, faPrint, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { imageUrl, isEmptyOrWhiteSpace } from '@/lib/utils/utils';

type Item = {
  tags?: { value: string; label: string }[]
} & OstDocument

type Props = {
  collection: 'exams'
  iconType: 'math' | 'cz'
  title?: string
  items: Item[]
  priority?: boolean
}

const ContentGrid = ({
  title = 'More',
  items,
  collection,
  iconType,
  priority = false
}: Props) => {
  return (
    <section id={collection}>
      <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight dark:text-white">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mb-8">
        {items.map((item, id) => (

          <div key={item.slug} className="p-4 cursor-pointer border project-card rounded-md md:w-full scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 hover:shadow overflow-hidden">

            {(
              <div className='h-full flex flex-col gap-2'>
                <Link className="grow flex flex-col gap-2" href={`/prospect/${item.slug}`}>
                  <div className="flex gap-5 items-start">

                    {iconType == "math" && <FontAwesomeIcon icon={faSquareRootVariable} size='3x' ></FontAwesomeIcon>}
                    {iconType == "cz" && <FontAwesomeIcon icon={faBookAtlas} size='3x' ></FontAwesomeIcon>}
                    <h3 className="text-xl mb-2 leading-snug font-bold hover:underline">
                      {item.title}

                    </h3>
                  </div>
                  <div className='relative'>
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


                  <p className="text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                </Link>
                <div className='flex gap-4 items-center'>
                  <div className='grow'>
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
                  </div>
                  <div className='flex gap-4'>
                    <Link href={`/paper/${item.slug}`}>
                      <FontAwesomeIcon icon={faPrint} size='2xl' ></FontAwesomeIcon>
                    </Link>
                    <Link href={`/sheet/${item.slug}`}>
                      <FontAwesomeIcon icon={faPenToSquare} size='2xl' ></FontAwesomeIcon>
                    </Link>
                    <Link href={`/wizard/${item.slug}`}>
                      <FontAwesomeIcon icon={faWaveSquare} size='2xl' ></FontAwesomeIcon>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ContentGrid