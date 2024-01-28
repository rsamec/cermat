'use client'
import React, { ReactNode, useEffect } from 'react';

const LeavePageWarning = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      const confirmationMessage = 'Are you sure you want to leave this page?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); 
  
  return (
    <div>
      {children}
    </div>
  );
};

export default LeavePageWarning;
