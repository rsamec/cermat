'use client'
import * as React from "react";
import { ReactNode } from "react";

function Steps(props: {steps: {id:string, renderComponent: () => ReactNode} []}) {
  return (
    <div>
      <div className="flex items-center gap-1">
      {props.steps.map((d, i) => <button className="btn btn-blue" key={i} onClick={() => {}}>{d.id}</button>)}
      {props.steps.map((d, i) => (
          <div key={i}>{d.renderComponent()}</div>
                  // <div key={i}
                  //   dangerouslySetInnerHTML={{ __html: d.renderComponent() }}
                  // />
                ))
      }
      
      </div>     
    </div>
  );
}

export default Steps;

