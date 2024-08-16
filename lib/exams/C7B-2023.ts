
import { g } from "vitest/dist/suite-6Pt_ep5V.js";
import { optionBool, group, wordsGroup, word, sortedOptions, words, option, tasks4Max2Points, threePoints, fourPoints, twoPoints, selfEvaluate, selfEvaluateText, number, numbers } from "../utils/quiz-builder";

const form = group({
1:option('D'),
2:option('B'),
3:option('D'),
4:option('D'),
5:option('C'),
6:group({
  6.1:option('B'),
  6.2:option('E'),
  6.3:option('C'),
}),
7:selfEvaluateText("např. Dost se jím inspiroval.",twoPoints),
8:group({
  8.1:optionBool(true),
  8.2:optionBool(true),
  8.3:optionBool(false),
  8.4:optionBool(false),
},tasks4Max2Points),
9:option('A'),
10:option('A'),
11:words("přístroj, sérii, výrobu", threePoints),
12:group({
  12.1:optionBool(false),
  12.2:optionBool(true),
  12.3:optionBool(true),
  12.4:optionBool(false),
},tasks4Max2Points),
13:option('B'),
14:sortedOptions(['A', 'C', 'B', 'F', 'E', 'D'], threePoints),
15:group({
  15.1:selfEvaluateText('např. Zvítězil, protože byl odvážný.'),
  15.2:selfEvaluateText('např. Od kamaráda žijícího na farmě dostal domácí sýr.'),
}),
//16
17: words("poměrně, holých, neunikly, zkrátka", fourPoints),
18:group({
  18.1:optionBool(false),
  18.2:optionBool(false),
  18.3:optionBool(true),
  18.4:optionBool(true),
},tasks4Max2Points),
19:option('D'),
20:option('B'),
21:option('D'),
22:option('C'),
23:group({
  23.1:optionBool(false),
  23.2:optionBool(true),
  23.3:optionBool(true),
  23.4:optionBool(true),
},tasks4Max2Points )
});

export default form;