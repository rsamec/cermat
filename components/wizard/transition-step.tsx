import React, { ReactNode } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TransitionStep: React.FC<{ children: ReactNode, direction: 'back' | 'next' }> = ({ children, direction }) => {
  
  const childComponents = React.Children.map(children, (child, index) => (
    <CSSTransition key={index}
      classNames={`step-${direction}`}
      timeout={{ enter: 600, exit: 800 }}>
    <div key={index}>
      {child}
    </div>
    </CSSTransition>
  ));

  return (
    <div className='relative'>
    <TransitionGroup>
      {childComponents}
    </TransitionGroup>
    </div>
  );
}
export default TransitionStep