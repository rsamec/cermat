'use client'
import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch } from "../lib/store";

const mapState = (state: RootState) => ({
  count: state.count,
});

const mapDispatch = (dispatch: Dispatch) => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { contentChunks: string[] } & StateProps & DispatchProps;

function Stepper(props: Props) {
  const content = props.contentChunks[props.count];
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="prose lg:prose-xl flex flex-col space-y-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

const StepperContainer = connect(mapState, mapDispatch)(Stepper);
export default StepperContainer