import { group, selfEvaluateText, wordsGroup, sortedOptions, words, option, tasks4Max2Points, threePoints, fourPoints, twoPoints, number, mathExpr, selfEvaluateImage, rootGroup } from "../utils/quiz-builder";

const form = rootGroup({
   code: 'MAMZD23C0T01',
   maxPoints: 50,
   questions: {
       closed: 11,
       opened: 14
   }
 }, { 
   1: number(22, { suffix: '%' }),
   2: mathExpr('a=-3c/b^2+2', { hintType: 'equation' }),
   3: mathExpr('2/x', { hintType: 'expression' }, twoPoints),
   4: mathExpr('K={-1;2}', { hintType: 'equation' }, twoPoints),
   5: group({
      5.1: mathExpr('64^n+0.5', { hintType: 'expression' }),
      5.2: mathExpr('5^2n-1', { hintType: 'expression' }),
   }),
   6: number(0),
   7: group({
      7.1: mathExpr('b^2=1/4', { hintType: 'equation' }),
      7.2: selfEvaluateImage("graf.jpeg"),
   }),
   8: mathExpr('(-8;-6>', { hintType: 'expression' }),
   //neni hotovo kuli 8 
   9: number(3, { suffix: 'krát' }),
   10: group({
      10.1: number(2.80, { suffix: 'Kč' }),
      10.2: mathExpr('(2.8-0.4x)', { hintType: 'expression', suffix: 'Kč' },),
      //chybi kc
   }),
   11: mathExpr('x=2+2t', { hintType: 'equation' }),
   12: mathExpr('D[0;19]', { hintType: 'expression' }),
   13: group({
      13.1: mathExpr('35m^2', { hintType: 'expression' }, twoPoints),
      13.2: mathExpr('613m^3', { hintType: 'expression' }, twoPoints),
   }),
   14: number(1040, { suffix: 'm' }, threePoints),
   15: group({
      15.1: option('N'),
      15.2: option('A'),
      15.3: option('A'),
   }),
   16: option('A', twoPoints),
   17: option('C', twoPoints),
   18: option('E', twoPoints),
   19: option('B', twoPoints),
   20: option('A', twoPoints),
   21: option('B', twoPoints),
   22: option('D', twoPoints),
   23: option('D', twoPoints),
   24: option('C', twoPoints),
   25: group({
      25.1: option('D', twoPoints),
      25.2: option('E', twoPoints),
   })
});
export default form
