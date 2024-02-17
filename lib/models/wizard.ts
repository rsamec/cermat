import { createModel } from '@rematch/core';
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
	currentStep: Question | null; // Use Question type directly
}

export type QuestionData = { content: string, options: Option<string>[], header?: { title: string, content: string, mutliColumnLayout: boolean } }

const initState: WizardState = {
	steps: [],
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
				currentStep: nextIndex < state.steps.length ? state.steps[nextIndex] : state.currentStep,
			};
		},
		goToPreviousStep(state) {
			const currentIndex = state.steps.findIndex((question) => question.id === state.currentStep?.id);
			const previousIndex = currentIndex - 1;

			return {
				...state,
				currentStep: previousIndex >= 0 ? state.steps[previousIndex] : state.currentStep,
			};
		},
		goToFirstStep(state){
			return {
				...state,
				currentStep: state.steps[0]
			}
		},
		goToLastStep(state){
			return {
				...state,
				currentStep: state.steps[state.steps.length - 1]
			}
		},
		goToStep(state, id: string) {
			const stepIndex = state.steps.findIndex((question) => question.id === id);


			return {
				...state,
				currentStep: stepIndex >= 0 && stepIndex < state.steps.length ? state.steps[stepIndex] : state.currentStep,
			};
		},
	},
	selectors: (slice) => ({
		currentStepIndex() {
			return slice(state => state.currentStep != null ? state.steps.indexOf(state.currentStep) : -1)
		},		
	})
});