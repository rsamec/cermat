// src/models/quiz.ts
import { createModel } from '@rematch/core';
import { RootModel } from './index';
import { TreeNode, getAllLeafsWithAncestors } from '../utils/tree.utils';
import { AnswerGroup, AnswerGroupMetadata, AnswerMetadata, convertTree, getVerifyFunction } from '../utils/form-answers';

export interface Question {
	id: string;
	metadata: AnswerMetadata<any>
	data?: QuestionData
}

export interface QuestionGroup {
	id: string;
	metadata?: AnswerGroupMetadata<any>

}

export interface QuizState {
	tree?: TreeNode<QuestionGroup | Question>
	questions: Question[]
	currentStep: Question | null; // Use Question type directly
	answers: Record<string, string>;
	corrections: Record<string, boolean>;
	totalPoints: number;
}
export type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';
export type AnswerState = { value: any, status: AnswerStatus }

export type QuestionData = { content: string, options: string[] }

export const quiz = createModel<RootModel>()({
	state: {
		questions: [],
		currentStep: null,
		answers: {},
		corrections: {},
		totalPoints: 0,
	} as QuizState,
	reducers: {
		init(state, { quiz, leafs }: { quiz: AnswerGroup<any>, leafs: QuestionData[] }) {

			const tree = convertTree<QuestionGroup | Question>(quiz);

			const questions = getAllLeafsWithAncestors(tree).map((d, i) => ({
				...d.leaf.data,
				data: leafs[i],
			} as Question))

			return {
				...state,
				tree,
				questions,
				currentStep: questions.length > 0 ? questions[0] : null,
			}
		},
		setAnswer(state, { questionId, answer }: { questionId: string; answer: string }) {
			const question = state.questions.find(d => d.id === questionId);
			if (question == null) {
				throw `Question ${questionId} does not exist.`;
			}
			return {
				...state,
				answers: {
					...state.answers,
					[questionId]: answer,
				},
				corrections: {
					...state.corrections,
					[questionId]: verifyQuestion(question, answer)
				}
			};
		},
		submitQuiz(state) {
			return {
				...state,
				corrections: calculateCorrections(state),
				totalPoints: calculateTotalPoints(state),
			};
		},
		goToNextStep(state) {
			const currentIndex = state.questions.findIndex((question) => question.id === state.currentStep?.id);
			const nextIndex = currentIndex + 1;

			return {
				...state,
				currentStep: nextIndex < state.questions.length ? state.questions[nextIndex] : state.currentStep,
			};
		},
		goToPreviousStep(state) {
			const currentIndex = state.questions.findIndex((question) => question.id === state.currentStep?.id);
			const previousIndex = currentIndex - 1;

			return {
				...state,
				currentStep: previousIndex >= 0 ? state.questions[previousIndex] : state.currentStep,
			};
		},
		goToStep(state, id: string) {
			const stepIndex = state.questions.findIndex((question) => question.id === id);


			return {
				...state,
				currentStep: stepIndex >= 0 && stepIndex < state.questions.length ? state.questions[stepIndex] : state.currentStep,
			};
		},
	},
	selectors: (slice) => ({
		currentStepIndex() {
			return slice(state => state.currentStep != null ? state.questions.indexOf(state.currentStep) : -1)
		},
		totalAnswers() {
			return slice(state => Object.keys(state.answers).length)
		},
		currentAnswerState() {
			return slice((state) => {

				const currentStep = state.currentStep;
				if (!currentStep) {
					return { status: 'unanswered' };
				}

				const questionId = currentStep.id;
				const isCorrect = state.corrections[questionId];
				const hasAnswered = state.answers.hasOwnProperty(questionId);

				if (hasAnswered) {
					return { status: isCorrect ? 'correct' : 'incorrect', value: state.answers[questionId] };
				} else {
					return { status: 'unanswered' };
				}
			})
		},
	})
});

// Helper functions
const calculateCorrections = (state: QuizState) => {
	const { answers } = state;
	const corrections: Record<string, boolean> = {};

	state.questions.forEach((question) => {
		corrections[question.id] = verifyQuestion(question, answers[question.id])
	});

	return corrections;
};

const verifyQuestion = (question: Question, answer: string) => {
	const verifyBy = question.metadata.verifyBy;
	const validator = getVerifyFunction(verifyBy);
	return validator(answer) == null;
}

const calculateTotalPoints = (state: QuizState) => {
	const { corrections } = state;
	let totalPoints = 0;
	if (state.tree == null) return totalPoints;

	// state.group.forEach((group) => {
	// 	const groupCorrect = group.children.every(
	// 		(child) => 'questions' in child || corrections[(child as Question).id]
	// 	);

	// 	if (groupCorrect) {
	// 		totalPoints += group.points;
	// 	}
	// });

	return totalPoints;
};
