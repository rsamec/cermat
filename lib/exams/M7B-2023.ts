

import { group, mathExpr, mathRatio, number, option, optionBool, selfEvaluateImage, task3Max4Points, task3Max5Points, task3Max6Points, threePoints, twoPoints } from "../utils/quiz-builder";

const form = group({
    1: mathExpr("1:14", { hintType: 'expression' }),
    2: group({
        2.1: mathExpr("1/8", { hintType: 'fraction' }, twoPoints),
        2.2: mathExpr("-9/16", { hintType: 'fraction' }, twoPoints),
    }),
    3: group({
        3.1: number(10201),
        3.2: number(110, {}, twoPoints)
    }),
    4: group({
        4.1: number(120),
        4.2: number(6, {}, twoPoints),
    }),
    5: group({
        5.1: number(75, { suffix: 'korun' }, twoPoints),
        5.2: number(56, { suffix: 'bazénů' }, twoPoints),
    }),
    6: group({
        6.1: number(6, { suffix: 'pětičlenných skupin' }),
        6.2: number(15, { suffix: 'dvoučlenných skupin' }, twoPoints),
    }),
    7: group({
        7.1: number(140, { suffix: 'korun' }, twoPoints),
        7.2: number(960, { suffix: 'cm^3' }, twoPoints),
    }),
    8: selfEvaluateImage("V rovině leží bod F a přímka g.jpeg", threePoints),
    9: selfEvaluateImage("V rovině leží body S, Q a přímka p.jpeg", threePoints),
    10: group({
        10.1: option("A"),
        10.2: option("A"),
        10.3: option("A"),
    }, task3Max4Points),
    11: option("B", twoPoints),
    12: option("E", twoPoints),
    13: option("A", twoPoints),
    14: option("D", twoPoints),
    15: group({
        15.1: option("B"),
        15.2: option("A"),
        15.3: option("D"),
    }, task3Max6Points),
    16: group({
        16.1: number(52, { suffix: 'čtverečků' }),
        16.2: number(40, { suffix: 'šedých čtverečků' }),
        16.3: number(91, { suffix: 'bílých čtverečků' }, twoPoints),
    }),
});
export default form;
