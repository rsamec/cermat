import { Models } from "@rematch/core";
import { count } from "./count";
import { wizard } from "./wizard";
import { quiz } from './quiz';
import { timer } from "./timer";
export interface RootModel extends Models<RootModel> {
  count: typeof count;
  wizard: typeof wizard;
  quiz: typeof quiz;
  timer:typeof timer;

}
export const models: RootModel = { count, wizard, quiz, timer };