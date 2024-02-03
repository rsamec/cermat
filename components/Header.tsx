
import { ReactNode } from 'react';

const Header:  React.FC<{children?: ReactNode}> = ({ children }) => {
  return (
    <header className="sticky z-10 top-0 bg-slate-900 text-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-5 p-2">
        <div className="flex">
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header;