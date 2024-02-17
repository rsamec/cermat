import { Models } from "@rematch/core";
import { count } from "./count";
import { wizard } from "./wizard";
import { quiz } from './quiz';
export interface RootModel extends Models<RootModel> {
  count: typeof count;
  wizard: typeof wizard;
  quiz: typeof quiz;

}
export const models: RootModel = { count, wizard, quiz };