
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

const NothingThere:  React.FC<{children?: ReactNode}> = ({ children }) => {
  return (
    <section className="">
      <div className="max-w-6xl mx-auto px-5 p-2">
        <div className="flex flex-col items-center gap-5">
          <FontAwesomeIcon icon={faXmark} size={'4x'}></FontAwesomeIcon>
          <span className='text-3xl'>Nic jsme nenašli.</span>
        </div>
      </div>
    </section>
  )
}

export default NothingThere;