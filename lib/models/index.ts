import { Models } from "@rematch/core";
import { count } from "./count";
import { cart } from "./answers";
export interface RootModel extends Models<RootModel> {
  count: typeof count;
  cart:typeof cart;
}
export const models: RootModel = { count, cart };