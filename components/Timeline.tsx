import { cls } from "@/lib/utils/utils";
import Link from "next/link";


const Timeline: React.FC<{ items: { text: string, year: number ,description?: string, slug: string }[] }> = ({ items }) => {
  return (
    <div className  ="w-full max-w-3xl mx-auto">
      <div className="-my-6">
        {items.map((data, i, arr) =>


          <div className="relative pl-8 sm:pl-32 py-6 group">

            <Link className="font-caveat font-medium text text-blue-600 mb-1 sm:mb-0" href={`/wizard/${data.slug}`}>Spustit test</Link>

            <div className={cls([
              "flex flex-col sm:flex-row items-start mb-1 before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-blue-600 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5",
              i === arr.length - 1 && "before:hidden"])}>
              <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-white-600 bg-blue-600 rounded-full">{data.year}</time>
              <Link className="text-xl font-bold text-slate-900 dark:text-white" href={`/prospect/${data.slug}`}>{data.text}</Link>
            </div>

            <div className="text-slate-500">{data.description}</div>
          </div>

        )}
      </div>
    </div>

  )
}

export default Timeline;