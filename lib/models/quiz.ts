import { createModel } from '@rematch/core';
import { RootModel } from './index';
import { TreeNode, getAllLeafsWithAncestors } from '../utils/tree.utils';
import { Answer, AnswerMetadataTreeNode, calculateMaxTotalPoints, calculatePoints } from '../utils/quiz-specification';
import { getVerifyFunction } from '../utils/assert';
import { GroupCompute } from '../utils/catalog-function';

export interface QuizState {
  assetPath?: string[]
  tree?: TreeNode<Answer<any>>
  questions: AnswerMetadataTreeNode<any>[]
  answers: Record<string, any>;
  corrections: Record<string, boolean>;
  totalPoints: number;
  maxTotalPoints: number;
}

const initState: QuizState = {
  questions: [],
  answers: {},
  corrections: {},
  totalPoints: 0,
  maxTotalPoints: 0
}

export const quiz = createModel<RootModel>()({
  state: { ...initState },
  reducers: {
    init(state, { tree, assetPath }: { tree: TreeNode<Answer<any>>, assetPath:string[] }) {

      const questions = getAllLeafsWithAncestors(tree).map((d, i) => d.leaf.data as AnswerMetadataTreeNode<any>)
      return {
        ...initState,
        questions,
        tree,
        assetPath,
        maxTotalPoints: calculateMaxTotalPoints(tree)
      }
    },
    submitQuizAnswer(state, { questionId, answer }: { questionId: string; answer: string }) {
      const question = state.questions.find(d => d.id === questionId);
      if (question == null) {
        throw `Question ${questionId} does not exist.`;
      }
      const answers = {
        ...state.answers,
        [questionId]: answer,
      }
      const corrections = {
        ...state.corrections,
        [questionId]: verifyQuestion(question, answer)
      }
      return {
        ...state,
        answers,
        corrections,
        totalPoints: calculateTotalPoints(state, { corrections, answers })
      };
    },
    submitQuiz(state, answers: Record<string, any>) {
      const corrections = calculateCorrections(state, answers);
      return {
        ...state,
        answers,
        corrections,
        totalPoints: calculateTotalPoints(state, { corrections, answers }),
      };
    },
  },
  selectors: (slice) => ({
    totalAnswers() {
      return slice(state => Object.keys(state.answers).length)
    },
  })
});

// Helper functions
const calculateCorrections = (state: QuizState, answers: Record<string, any>) => {
  const corrections: Record<string, boolean> = {};

  state.questions.forEach((question) => {
    corrections[question.id] = verifyQuestion(question, answers[question.id])
  });

  return corrections;
};

const verifyQuestion = (question: AnswerMetadataTreeNode<any>, answer: string) => {
  const verifyBy = question.node.verifyBy;
  const validator = getVerifyFunction(verifyBy);
  return validator(answer) == null;
}


const calculateTotalPoints = (state: QuizState, { corrections, answers }: { corrections: Record<string, boolean>, answers: Record<string, any> }) => {
  let totalPoints = 0;
  const tree = state.tree;
  if (tree == null) return totalPoints;

  const calculateSum = (children: AnswerMetadataTreeNode<any>[]) => children.reduce((out, d) => {
    out += d.node.points == null && d.node.verifyBy.kind == "selfEvaluate"
      ? (answers[d.id]?.value ?? 0) : corrections[d.id] ? (d.node.points ?? 0) : 0
    return out;
  }, 0)
  const calculateCustom = (computBy: GroupCompute, children: AnswerMetadataTreeNode<any>[]) => {
    const successCount = children.map(d => corrections[d.id]).filter(d => d).length;
    const points = computBy.args.filter(d => d.min <= successCount).map(d => d.points);
    return points.length > 0 ? Math.max(...points) : 0
  }


  totalPoints = calculatePoints(tree, (computeBy, leafs) => computeBy != null && computeBy.kind == "group"
    ? calculateCustom(computeBy, leafs)
    : calculateSum(leafs))

  return totalPoints;

};