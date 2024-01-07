'use client'

import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch } from "../../lib/store";

const mapState = (state: RootState) => state.quiz;

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.quiz.next(),
  back: () => dispatch.quiz.back(),
  goTo: (id: string) => dispatch.quiz.goTo(id),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;


function Stepper(props: Props) {
  return (
    <div>
      <div className="flex items-center gap-1">

      
      {props.questions.map((d, i) => <button className="btn btn-blue" key={i} onClick={() => props.goTo(d.id) } >{d.id}</button>)}
      </div>
      {/* <div>
        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          onClick={() => props.next()}>next</button>
        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          onClick={() => props.back()}>back</button>
      </div> */}
    </div>
  );
}

export default connect(mapState, mapDispatch)(Stepper);

