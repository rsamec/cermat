'use client'
import React, { ReactNode } from 'react';

interface Props {
  className: string;
  children: ReactNode,  
}

const MathSolverLinkComponent: React.FC<Props> = ({ className, children }) => {
  const baseUrl = "https://math.rsamec.workers.dev"
  const handleClick = () => {
    const element = document.querySelector('.katex-display');
    if (!element) {
      window.open(baseUrl,'_blank')
      return;
    } 
    const latexExp = element.querySelector('math semantics annotation')?.textContent;
    if (!latexExp) {
      return;
    }
    const hrefWithQuery = `${baseUrl}/?q=${encodeURIComponent(latexExp.replace(/\{,\}/g,"."))}`
    window.open(hrefWithQuery,'_blank')
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default MathSolverLinkComponent;
