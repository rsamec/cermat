import { createModel } from '@rematch/core';
import { RootModel } from './index';
import { TreeNode } from '../utils/tree.utils';
import { AnswerGroupMetadata, AnswerMetadata } from '../utils/quiz-specification';
import { getVerifyFunction } from '../utils/catalog-function';
import { Option } from '../utils/utils'

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

export type QuestionData = { content: string, options: Option<string>[], header?: { title: string, content: string } }

const initState: QuizState = {
	questions: [],
	currentStep: null,
	answers: {},
	corrections: {},
	totalPoints: 0,
}

export const quiz = createModel<RootModel>()({
	state: { ...initState },
	reducers: {
		init(state, { questions, tree }: { questions: Question[], tree: TreeNode<Question | QuestionGroup> }) {

			// const tree = convertTree<QuestionGroup | Question>(quiz);

			// const questions = getAllLeafsWithAncestors(tree).map((d, i) => ({
			// 	...d.leaf.data,
			// 	data: leafs[i],
			// } as Question))

			return {
				...initState,
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
			const corrections = {
				...state.corrections,
				[questionId]: verifyQuestion(question, answer)
			}
			return {
				...state,
				answers: {
					...state.answers,
					[questionId]: answer,
				},
				corrections,
				totalPoints: calculateTotalPoints(state, corrections)
			};
		},
		submitQuiz(state) {
			return {
				...state,
				corrections: calculateCorrections(state),
				totalPoints: calculateTotalPoints(state, state.corrections),
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


const calculateTotalPoints = (state: QuizState, corrections: Record<string, boolean>) => {
	let totalPoints = 0;
	const tree = state.tree;
	if (tree == null) return totalPoints;

	const calculateSum = (children: Question[]) => children.reduce((out, d) => out += corrections[d.id] ? (d.metadata.points ?? 0) : 0, 0)
	const calculateCustom = (children: Question[]) => {
		const successCount = children.map(d => corrections[d.id]).filter(d => d).length;
		return successCount == children.length ? 4 : successCount >= 2 ? 2 : 0
	}

	const traverse = (node: TreeNode<Question | QuestionGroup>, leafs: Question[]) => {
		let total = 0;

		// Check if the current node is a leaf (no children)
		if (!node.children || node.children.length === 0) {
			leafs.push(node.data as Question);
		}
		else {
			const group = node.data as QuestionGroup;
			//clear leafs for each composite node
			leafs = []
			// Recursively calculate total points for each child node						
			for (const childNode of node.children) {
				total += traverse(childNode, leafs);
			}

			//points for leafs
			total += leafs.length > 0 ? (group.metadata?.computeBy != null ? calculateCustom(leafs) : calculateSum(leafs)) : 0;
		}
		return total
	}

	totalPoints = traverse(tree, [])

	return totalPoints;

};
