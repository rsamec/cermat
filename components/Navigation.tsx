import Link from 'next/link'

const Navigation = ({name}: {name: string}) => {
  return (
    <nav className="layout flex items-center justify-between">     
      <ul className="flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          /
        </li>
        <li>      
            {name}          
        </li>     
      </ul>
    </nav>
  )
}

export default Navigation