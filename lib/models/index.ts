import { Models } from "@rematch/core";
import { count } from "./count";
import { quiz } from "./quiz";
export interface RootModel extends Models<RootModel> {
  count: typeof count;  
  quiz: typeof quiz
}
export const models: RootModel = { count, quiz };