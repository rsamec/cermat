import { cls } from '@/lib/utils/utils'
import Footer from './Footer'
import Header from './Header'

type Props = {
  headerNavigation: React.ReactNode
  showContact?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const Layout = ({ children, headerNavigation, fullWidth, showContact }: Props) => {
  return (
    <>
      <Header>
        {headerNavigation}
      </Header>
      <div className={cls(["min-h-screen mx-auto p-5", !fullWidth && "max-w-6xl"])}>
        <main>{children}</main>
      </div>
      <Footer showContact={showContact} />
    </>
  )
}

export default Layout