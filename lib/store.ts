import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import selectPlugin from "@rematch/select";
import { models, RootModel } from "./models";

export const store = init({
  models,
   // add selectPlugin to your store
   plugins: [selectPlugin()],
});
export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;