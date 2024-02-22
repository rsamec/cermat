import { ReactNode } from "react";

const StatsCard: React.FC<{ value: number, text: string, icon: ReactNode, description?: string }> = ({ value, text, icon, description }) => {
  return (<div className="min-w-48">
    <div

      className="block h-full rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <div className="flex justify-center">
        <div className="-mt-8 inline-block rounded-full bg-primary-100 p-4 text-primary shadow-md">
          {icon}
        </div>
      </div>
      <div className="p-6 flex flex-col justify-center text-center">
        <h3 className="mb-4 text-5xl font-bold text-primary dark:text-primary-400">
          {value}
        </h3>
        <h5 className="mb-4 text font-medium">{text}</h5>
        <p className="text-neutral-500 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  </div>)
}

export default StatsCard