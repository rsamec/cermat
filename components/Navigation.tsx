import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

const Navigation = ({ name }: { name?: string }) => {
  return (
    <nav className="layout flex items-center justify-between">
      <ul className="flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
        <li>
          <Link href="/" className="hover:underline flex gap-2 items-center">
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home
          </Link>
        </li>
        {name != null && <>
          <li>
            /
          </li>
          <li>
            {name}
          </li>
        </>}
      </ul>
    </nav>
  )
}

export default Navigation