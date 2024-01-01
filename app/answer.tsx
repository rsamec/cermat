'use client'
import React, { useState } from "react";
import { connect } from "react-redux";
import { RootState, Dispatch } from "../lib/store";
import { TextAnswer } from "@/lib/models/answers";
import RadioButtonGroup from "@/components/core/RadioButtonGroup";

const mapState = (state: RootState) => ({
  count: state.count,
});

const mapDispatch = (dispatch: Dispatch) => ({
  addAnswer: (answer: TextAnswer) => dispatch.cart.add(answer),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { code: string } & StateProps & DispatchProps;

function StepAnswer(props: Props) {
  const [selected, setSelected] = useState<string>()
  const customOptions = [
    { id: 1, name: 'Ano', value: true },
    { id: 2, name: 'Ne', value: false },
    // ...
  ];
  return (
    <div>
      <RadioButtonGroup
        options={customOptions}
        format={(option) => option.name}
        value={option => option.value.toString()}
        onSelect={(selected) => setSelected(v => selected)}
      />
      <button disabled={selected == null} onClick={() => {
        if (selected == null) return;
        props.addAnswer({ code: props.code, value: selected })
      }} >Zkontrolovat</button>
    </div>
  );
}

const StepAnswerContainer = connect(mapState, mapDispatch)(StepAnswer);
export default StepAnswerContainer