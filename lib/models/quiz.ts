import { createModel } from "@rematch/core";
import { RootModel } from ".";
import { ReactNode } from "react"
import { FormControl, FormAnswerMetadata } from "../utils/form.utils";
import { ValidationResult } from "../utils/validators";
import questions from "../exams/math2";
export interface Question<T> {
	id: string
	control: FormControl<any, FormAnswerMetadata>
	renderComponent: (question: T) => ReactNode
}
export interface Quiz {
	currentStep: Question<string>
	questions: Question<any>[]
	answers: SimpleAnswer[]
}

type Answer<T> = { answer: T, questionId: string; }
export type SimpleAnswer = Answer<{ value: any, error: ValidationResult }>;

export const quiz = createModel<RootModel>()({
	state: {
		currentStep: questions[0],
		questions,
		answers: [],
	} as Quiz,
	reducers: {
		next: (state) => {
			const currentIndex = questions.indexOf(state.currentStep);
			const nextStep = currentIndex + 1 == questions.length ? state.currentStep : questions[currentIndex + 1];
			return {
				...state,
				currentStep: nextStep
			}
		},
		back: (state) => {
			const currentIndex = questions.indexOf(state.currentStep);
			const previousStep = currentIndex == 0 ? state.currentStep : questions[currentIndex - 1];
			return {
				...state,
				currentStep: previousStep
			}
		},
		goTo: (state, payload:string) => {
			const step = questions.find(d => d.id == payload);
			return {
				...state,
				...(step !=null && {currentStep: step})
			}
		},
		validate: (state) => {
			const currentControl = state.currentStep.control;
			const currentQuestionId = state.currentStep.id;
			const otherAnswers = state.answers.filter((item) => item.questionId !== currentQuestionId);
			return {
				...state,
				answers: [...otherAnswers, { questionId: state.currentStep.id , answer: { value: currentControl.value, error: currentControl.validate() } }]
			}
		}
	},
	selectors: (slice) => ({
		currentStepIndex() {
			return slice((state) => questions.indexOf(state.currentStep));
		},
		currentAnswer() {
			return slice((state)=> state.answers.find((d) => d.questionId === state.currentStep.id))
		},		
		totalAnswers() {
			return slice(state => state.answers.length)
		},
	}),
});