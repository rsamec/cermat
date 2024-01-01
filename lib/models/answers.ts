import { createModel } from "@rematch/core";
import { RootModel } from ".";

export type Answer<T> = { code: string, value: T}
export type TextAnswer = Answer<string>;

export const cart = createModel<RootModel>()({
  state: [] as TextAnswer[] ,
	reducers: {
		add: (cart, added) => [...cart, added],
		remove: (cart, removed) => cart.filter((item) => item.code !== removed.code),
	},
	selectors: (slice) => ({
		// totalAnswers() {
		// 	return slice((cart) => cart.reduce((t, item) => t + item.value, 0))
		// },
		totalAnswers() {
			return slice(cart => cart.length);
		},    
		items() {
			return slice
		},
	}),
});