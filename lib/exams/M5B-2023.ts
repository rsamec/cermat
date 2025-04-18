
import { group, mathRatio, number, option, rootGroup, selfEvaluateImage, task3Max4Points, threePoints, twoPoints } from "../utils/quiz-builder";

const form = rootGroup({
  code: 'M5PBD23C0T02',
  maxPoints: 50,
  questions: {
      closed: 6,
      opened: 8
  }
}, {

  1: group({
    1.1: number(31, {}, twoPoints),
    1.2: number(2050, {}, twoPoints)
  }),
  2: group({
    2.1: number(320, { suffix: 'cm' }, twoPoints),
    2.2: mathRatio("1:14", twoPoints),
  }),
  3: group({
    3.1: number(320,),
    3.2: number(5, { suffix: 'palindromických čísel' }, twoPoints),
    3.3: number(110, {}, twoPoints)
  }),
  4: group({
    4.1: number(75, { suffix: 'korun' }, twoPoints),
    4.2: number(24, { suffix: 'bazénů' }, twoPoints)
  }),
  5: group({
    5.1: number(6, { suffix: 'pětičlenných skupin' },),
    5.2: number(15, { suffix: 'dvoučlenných skupin' }, twoPoints)
  }),

  6: group({
    6.1: number(68, { suffix: 'cm' },),
    6.2: number(28, { suffix: 'cm', prefix: 'o' },),
    6.3: number(78, { suffix: 'cm' }, twoPoints)
  }),
  7: group({
    7.1: selfEvaluateImage("", threePoints),
    7.2: selfEvaluateImage("", threePoints),
  }),
  8: group({
    8.1: option("A"),
    8.2: option("A"),
    8.3: option("A"),
  }, task3Max4Points),
  9: option("A", twoPoints),
  10: option("D", twoPoints),
  11: option("E", twoPoints),
  12: option("E", twoPoints),
  13: group({
    13.1: option("C"),
    13.2: option("D"),
    13.3: option("B"),
  }, task3Max4Points),
  14: group({
    14.1: number(52, { suffix: 'čtverečků' },),
    14.2: number(40, { suffix: 'šedých čtverečků' },),
    14.3: number(91, { suffix: 'bílých čtverečků' }, twoPoints)
  })
});
export default form;
