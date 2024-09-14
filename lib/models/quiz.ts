import { RematchRootState, createModel } from '@rematch/core';
import { RootModel } from './index';
import { TreeNode, getAllLeafsWithAncestors } from '../utils/tree.utils';
import { Answer, AnswerMetadataTreeNode, calculateMaxTotalPoints, calculatePoints } from '../utils/quiz-specification';
import { getVerifyFunction, ValidationFunctionSpec } from '../utils/assert';
import { GroupCompute } from '../utils/catalog-function';
import { get, del, set } from '../utils/storage.utils';

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
    init(state, { tree, assetPath, answers }: { tree: TreeNode<Answer<any>>, assetPath: string[], answers: Record<string, any> }) {
      const questions = getAllLeafsWithAncestors(tree).map((d, i) => d.leaf.data as AnswerMetadataTreeNode<any>)
      const keys = Object.keys(answers);
      const corrections = calculateCorrections(questions.filter(d => keys.indexOf(d.id) != -1), answers);

      return {
        ...initState,
        questions,
        tree,
        answers,
        assetPath,
        corrections,
        totalPoints: calculateTotalPoints({ tree, corrections, answers }),
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
      set(getStorageKey(state.assetPath!), answers)
      return {
        ...state,
        answers,
        corrections,
        totalPoints: calculateTotalPoints({ tree: state.tree, corrections, answers })
      };
    },
    submitQuiz(state, answers: Record<string, any>) {
      const corrections = calculateCorrections(state.questions, answers);
      set(getStorageKey(state.assetPath!), answers)
      return {
        ...state,
        answers,
        corrections,
        totalPoints: calculateTotalPoints({ tree: state.tree, corrections, answers }),
      };
    },
    resetQuizAnswers(state) {
      const answers = {};
      const corrections = {}
      del(getStorageKey(state.assetPath!));
      return {
        ...state,
        answers,
        corrections,
        totalPoints: calculateTotalPoints({ tree: state.tree, corrections, answers }),

      }
    }
  },
  selectors: (slice) => ({
    totalAnswers() {
      return slice(state => Object.keys(state.answers).length)
    },
    points() {
      return slice(state => state.tree?.children?.reduce((out, d) => {
        out[d.data.id] = {
          v: calculateTotalPoints({ tree: d, corrections: state.corrections, answers: state.answers }),
          max: calculateMaxTotalPoints(d)
        }
        return out;
      }, {} as Record<string, {v:number, max:number}>))
    },    
  }),
  effects: (dispatch) => ({
    async initAsync({ tree, assetPath }: { tree: TreeNode<Answer<any>>, assetPath: string[] }, rootState: RematchRootState<RootModel>) {
      let answers = await get(getStorageKey(assetPath!), {});
      dispatch.quiz.init({ tree, assetPath, answers })
    },
    async submitQuizAnswerAsync({ questionId, answer }: { questionId: string; answer: string }, rootState: RematchRootState<RootModel>) {
      //always submit answer
      dispatch.quiz.submitQuizAnswer({ questionId, answer });

      setTimeout(() => {
        dispatch.wizard.goToFirstAvailableAsync(rootState.wizard.currentStep);
      }, 500)

    }
  })
});

const getStorageKey = (assetPath: string[]) => {
  return assetPath.join("-");
}
// Helper functions
const calculateCorrections = (questions: AnswerMetadataTreeNode<any>[], answers: Record<string, any>) => {
  const corrections: Record<string, boolean> = {};

  questions.forEach((question) => {
    corrections[question.id] = verifyQuestion(question, answers[question.id])
  });

  return corrections;
};

const verifyQuestion = (question: AnswerMetadataTreeNode<any>, answer: string) => {
  return verifyQuestionResult(question.node.verifyBy, answer) == null
}
const verifyQuestionResult = (verifyBy: ValidationFunctionSpec<any>, answer: string) => {
  const validator = getVerifyFunction(verifyBy);
  return validator(answer);
}
const calculatePointsByErrorCount = (d: AnswerMetadataTreeNode<any>, answers: Record<string, any>) => {
  const error = verifyQuestionResult(d.node.verifyBy, answers[d.id]);
  if (error != null) {
    return error.errorCount != null ? Math.max(Math.max((d.node.points ?? 0) - error.errorCount, 0)) : 0;
  }
  return d.node.points ?? 0;
}


const calculateTotalPoints = ({ tree, corrections, answers }: { tree?: TreeNode<Answer<any>>, corrections: Record<string, boolean>, answers: Record<string, any> }) => {
  let totalPoints = 0;
  if (tree == null) return totalPoints;

  const calculateSum = (children: AnswerMetadataTreeNode<any>[]) => children.reduce((out, d) => {
    out += d.node.points == null && d.node.verifyBy.kind == "selfEvaluate"
      ? (answers[d.id]?.value ?? 0)
      : !corrections[d.id] && d.node.verifyBy.kind == "equalStringCollection" || d.node.verifyBy.kind == "equalNumberCollection"
        ? calculatePointsByErrorCount(d, answers)
        : corrections[d.id] ? (d.node.points ?? 0) : 0
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