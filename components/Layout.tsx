import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Footer from './Footer'
import Header from './Header'
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header>
          <Link href="/" className="hover:underline flex gap-2 items-center">
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home
          </Link>
      </Header>
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default Layout