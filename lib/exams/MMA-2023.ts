import { optionBool, group, selfEvaluateText, wordsGroup, sortedOptions, words, option, tasks4Max2Points, threePoints, fourPoints, twoPoints, number, mathExpr, selfEvaluateImage } from "../utils/quiz-builder";

const form = group({
   1:number(22, { suffix: '%' }),
   2:mathExpr('a=-3c/b^2+2', { hintType: 'equation' }),
   3:mathExpr('2/x', { hintType: 'expression' },twoPoints),
   4:mathExpr('K={-1;2}', { hintType: 'equation' },twoPoints),
   5:group({
    5.1:mathExpr('64^n+0.5', { hintType: 'expression' }),
    5.2:mathExpr('5^2n-1', { hintType: 'expression' }),
   }),
   6:number(''),
   7:group({
    7.1:mathExpr('b^2=1/4', { hintType: 'equation' }),
    7.2: selfEvaluateImage("graf.jpeg"),
   }),
   8:mathExpr('(-8;-6>', { hintType: 'expression' }), 
   //neni hotovo kuli 8 
   9:number(3, { suffix: 'krát' }), 
   10:group({
    10.1:number(2.80, { suffix: 'Kč' }), 
    10.2:mathExpr('(2.8-0.4x)', { hintType: 'expression' },),
    //chybi kc
   }),
   11:mathExpr('x=2+2t', { hintType: 'equation' }),
   12:mathExpr('D[0;19]', { hintType: 'expression' }),
   13:group({
    13.1:mathExpr('35m^2', { hintType: 'expression' }),
    13.2:mathExpr('613m^3', { hintType: 'expression' }),
   })
});
export default form
