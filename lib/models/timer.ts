import { createModel } from '@rematch/core';
import { RootModel } from ".";

// Define your models
export const timer = createModel<RootModel>()({
    state: {
        time: 70 * 60 , // Initial time in seconds
    },
    reducers: {
        decrement(state) {
            return { ...state, time: state.time - 1 };
        },
    },
    effects: (dispatch) => ({
        async startTimer() {
            while (true) {
                dispatch.timer.decrement(); // Decrement the time
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            }
        },
    }),
});