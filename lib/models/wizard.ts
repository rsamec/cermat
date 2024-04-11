import { RematchRootState, createModel } from '@rematch/core';
import { RootModel } from './index';
import { Option } from '../utils/utils'
import { AnswerMetadata } from '../utils/quiz-specification';

export interface Question {
	id: string;
	metadata: AnswerMetadata<any>
	data?: QuestionData
}

export interface WizardState {
	steps: Question[]
	previousStep: Question | null;
	currentStep: Question | null; // Use Question type directly
}

export type QuestionData = { content: string,
	 rawContent: string,
	 options: Option<string>[],
	 header?: { title: string, content: string, rawContent:string, mutliColumnLayout: boolean } }

const initState: WizardState = {
	steps: [],
	previousStep: null,
	currentStep: null,
}

export const wizard = createModel<RootModel>()({
	state: { ...initState },
	reducers: {
		init(state, { steps }: { steps: Question[] }) {

			return {
				...initState,
				steps,
				currentStep: steps.length > 0 ? steps[0] : null,
			}
		},
		submitQuiz(state) {
			return {
				...state,
			};
		},
		goToNextStep(state) {
			const currentIndex = state.steps.findIndex((question) => question.id === state.currentStep?.id);
			const nextIndex = currentIndex + 1;

			return {
				...state,
				previousStep: state.currentStep,
				currentStep: nextIndex < state.steps.length ? state.steps[nextIndex] : state.currentStep,
			};
		},
		goToPreviousStep(state) {
			const currentIndex = state.steps.findIndex((question) => question.id === state.currentStep?.id);
			const previousIndex = currentIndex - 1;

			return {
				...state,
				previousStep: state.currentStep,
				currentStep: previousIndex >= 0 ? state.steps[previousIndex] : state.currentStep,
			};
		},
		goToFirstStep(state) {
			return {
				...state,
				previousStep: state.currentStep,
				currentStep: state.steps[0]
			}
		},
		goToLastStep(state) {
			return {
				...state,
				previousStep: state.currentStep,
				currentStep: state.steps[state.steps.length - 1]
			}
		},
		goToStep(state, id: string) {
			const stepIndex = state.steps.findIndex((question) => question.id === id);


			return {
				...state,
				previousStep: state.currentStep,
				currentStep: stepIndex >= 0 && stepIndex < state.steps.length ? state.steps[stepIndex] : state.currentStep,
			};
		},
		goToNextAvailableStep(state, resolvedQuestions: string[]) {
			const currentIndex = state.steps.findIndex((question) => question.id === state.currentStep?.id);
			const firstAvailableIndex = state.steps.findIndex((d, i) => i > currentIndex && resolvedQuestions.indexOf(d.id) === -1)
			return {
				...state,
				previousStep: state.currentStep,
				currentStep: firstAvailableIndex !== -1 ? state.steps[firstAvailableIndex] : state.currentStep,
			};
		}
	},
	effects: (dispatch) => ({
		async goToFirstAvailableAsync(step: Question | null, rootState: RematchRootState<RootModel>) {
			const state = rootState.wizard;
			if (!(step == null || (step.id != state.currentStep?.id) || rootState.quiz.corrections[step.id] !== true)){
				dispatch.wizard.goToNextAvailableStep(Object.entries(rootState.quiz.corrections).filter(([key, value]) => value === true).map(([key, value]) => key))
			}
		}
	}),
	selectors: (slice) => ({
		currentStepIndex() {
			return slice(state => state.currentStep != null ? state.steps.indexOf(state.currentStep) : -1)
		},
		previousStepIndex() {
			return slice(state => state.previousStep != null ? state.steps.indexOf(state.previousStep) : -1)
		}
	})
});