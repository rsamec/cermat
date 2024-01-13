'use client'
import { AnswerMetadata } from "@/lib/utils/form-answers";
import { Option } from "@/lib/utils/utils";
import * as React from "react";
import { ReactNode, useEffect, useState } from "react";

function Loading() {
  return <div>Loading</div>;
}
function Loaded(props: { form: {text:string} }) {
  return <div>{JSON.stringify(props)}</div>;
}
function Step(props: { slug: string, answer?: AnswerMetadata<any>, options: string[] }) {
  const [comp, setComp] = useState(Loading);
  useEffect(() => {

    const load = async () => {
      const form = await import(`/public/${props.slug}.js`);
      setComp(<Loaded form={form.default}></Loaded>);
    }
    load()
  }, [props.slug])

  return (
    <div>{comp}</div>
  );
}

export default Step;

