'use client'
import * as React from "react";
import { Provider, connect } from "react-redux";
import { store, RootState, Dispatch } from "../lib/store";
import StepperContainer from "./stepper";
import StepAnswerContainer from "./answer";

const selection = store.select((models) => ({
  totalAnswers: models.cart.totalAnswers 
}));

const mapState = (state: RootState) => ({
  count: state.count,
  cart: state.cart,
  ...selection(state),
});

const mapDispatch = (dispatch: Dispatch) => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;


function Count(props: Props) {
  return (
    <div>
      The count is {props.count}
      The answer is {props.totalAnswers}
      <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={() => props.increment()}>increment</button>
      <button onClick={() => props.incrementAsync()}>incrementAsync</button>
    </div>
  );
}

const CountContainer = connect(mapState, mapDispatch)(Count);

export default function Counter(props: { contentChunks: string[] }) {
 
  return (
    <div>
      <Provider store={store}>
        <CountContainer />
        <StepperContainer contentChunks={props.contentChunks}></StepperContainer>       
        <StepAnswerContainer code={'1'}></StepAnswerContainer>
      </Provider>
    </div>
  )
}
