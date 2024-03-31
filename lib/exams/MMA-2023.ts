import { group, selfEvaluateText, wordsGroup, sortedOptions, words, option, tasks4Max2Points, threePoints, fourPoints, twoPoints, number, mathExpr, selfEvaluateImage, optionBool, task3Max3Points, task3Max6Points, task2Max4Points, rootGroup } from "../utils/quiz-builder";

const form = rootGroup({
   code: 'MAMZD23C0T01',
   maxPoints: 50,
   questions: {
       closed: 11,
       opened: 14
   }
 }, {
 
   1: number(25, { prefix: 'o', suffix: '%' }),
   2: number(424, {  suffix: 'cm^2^' }),
   3: mathExpr('1/2-x', { hintType: 'expression' }, twoPoints),
   4: mathExpr('{-4;1}', { prefix:'K=', hintType: 'expression' }, twoPoints),
   5: mathExpr('x=0, y=5/2', { hintType: 'expression' },twoPoints),
   6: mathExpr('{-1;9}', { prefix:'k=', hintType: 'expression' }, twoPoints),
   7: mathExpr('-8/3', { hintType: 'fraction' }, twoPoints),
   8: group({
      8.1: mathExpr('[2;-4]', { prefix:'S=', hintType: 'expression' }),
      8.2: selfEvaluateImage("image-9.png"),
   }),
   9: mathExpr('[0;-1/2]', { prefix:'P=', hintType: 'expression' }),
   //neni hotovo kuli 8 
   10: mathExpr('4pi/3', { prefix:'x=', hintType: 'expression' }, twoPoints),
   11: number(1),
   12: number(1.4),
   13: group({
      13.1: number(4.6, { prefix:'|AC|', suffix:'cm'}),
      13.2: number(8.2, { prefix:'|BD|', suffix:'cm'}, twoPoints),      
   }),
   14: number(57, { prefix:'využito', suffix: 'vydaných poukazů' }, threePoints),
   15: group({
      15.1: optionBool(true),
      15.2: optionBool(false),
      15.3: optionBool(false),
   }, task3Max3Points ),
   16: option('B', twoPoints),
   17: option('E', twoPoints),
   18: option('B', twoPoints),
   19: option('C', twoPoints),
   20: option('A', twoPoints),
   21: option('D', twoPoints),
   22: option('C', twoPoints),
   23: option('A', twoPoints),
   24: option('E', twoPoints),
   25: group({
      25.1: option('D', twoPoints),
      25.2: option('C', twoPoints),
   }, task2Max4Points)
});
export default form
