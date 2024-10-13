import { group, mathExpr, number, option, optionBool, rootGroup, selfEvaluateImage, task2Max3Points, task3Max4Points, task3Max6Points, threePoints, twoPoints } from "../utils/quiz-builder";

const form = rootGroup({
  code: 'M9PCD23C0T03',
  maxPoints: 50,
  questions: {
    closed: 5,
    opened: 11
  }
}, {

  1: number(7, { suffix: 'krát' }),
  2: group({
    2.1: number(-3),
    2.2: number(0.5)
  }),
  3: group({
    3.1: mathExpr("4/7", { hintType: 'fraction' }),
    3.2: mathExpr("-2/5", { hintType: 'fraction' }),
    3.3: mathExpr("5/8", { hintType: 'fraction' }, twoPoints),

  }),
  4: group({
    4.1: mathExpr("(2a+3)(2a-3)", { hintType: 'expression' }),
    4.2: mathExpr("-1/2", { hintType: 'expression' }),
    4.3: mathExpr("-12n+9", { hintType: 'expression' }, twoPoints),
  }),
  5: group({
    5.1: mathExpr("x=-2.5", { hintType: 'equation' }, twoPoints),
    5.2: mathExpr("y=0.3", { hintType: 'equation' }, twoPoints),
  }),
  6: group({
    6.1: mathExpr("(4/15)x", { hintType: 'expression' }),
    6.2: number(900, { suffix: 'km' }, twoPoints),
  }),
  7: group({
    7.1: number(5, { prefix:"r", suffix:"cm"}, twoPoints),
    7.2: number(940,{ prefix:"V", suffix:"cm^3^"}),

  }),
  8: group({
    8.1: number(152, { suffix: 'korun' }),
    8.2: number(750, { suffix: 'gramů' }, twoPoints),
  }),
  9: selfEvaluateImage("image-7.png", threePoints),
  10: group({
    10.1: selfEvaluateImage("image-8.png"),
    10.2: selfEvaluateImage("image-8.png")
  }, task2Max3Points),
  11: group({
    11.1: optionBool(true),
    11.2: optionBool(false),
    11.3: optionBool(true),
  }, task3Max4Points),
  12: option('C', twoPoints),
  13: option('D', twoPoints),
  14: option('B', twoPoints),
  15: group({
    15.1: option('E'),
    15.2: option('A'),
    15.3: option('B'),
  }, task3Max6Points),
  16: group({
    16.1: number(380, { suffix: 'bílých čtverečků' }),
    16.2: number(39, { suffix: 'šedých čtverečků' }),
    16.3: number(207, { suffix: 'šedých čtverečků' }, twoPoints)
  })

});
export default form;