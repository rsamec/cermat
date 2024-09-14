import { expect, test } from 'vitest'
import { Abbreviations, OptionList, ShortCodeMarker, chunkByAbbreviationType, chunkHeadingsList, getQuizBuilder } from './parser.utils'
import { parser, GFM, Subscript, Superscript } from '@lezer/markdown';
import { createTree, getAllLeafsWithAncestors } from './tree.utils';
import { Maybe } from './utils';

const markdownParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);

test('chunk by blocks', () => {

  const input = `  
VÝCHOZÍ TEXT K ÚLOZE 1
===

> Celý film trvá 1 hodinu. Doba, která ještě zbývá do konce filmu, je polovinou doby, která již uplynula od začátku filmu.

# 1
---
# 2
## 2.1

Vnitřní objem sudu je 15krát větší než objem kbelíku.\
Objem kbelíku je 5krát větší než objem konvičky. \
Ze sudu plného vody jsme třetinu vody odebrali, takže v něm zbylo 60 litrů vody.

**Vypočtěte v litrech objem konvičky.**

## 2.2

Kvádr je možné beze zbytku rozřezat na 200 krychlí, z nichž každá má objem 8 dm<sup>3</sup>.

**Vypočtěte, na kolik krychliček o objemu 1 cm<sup>3</sup> lze tento kvádr beze zbytku rozřezat.**

---`

  const parsedTree = markdownParser.parse(input);
  const rawHeadings = chunkByAbbreviationType(parsedTree, input, ["H1", "H2", "St"]);
  expect(rawHeadings.length).toBe(6);

})


test('chunk by blocks with exclusions', () => {

  const input = `  
VÝCHOZÍ TEXT K ÚLOZE 1
===

> Celý film trvá 1 hodinu. Doba, která ještě zbývá do konce filmu, je polovinou doby, která již uplynula od začátku filmu.

# 1
---
# 2
## 2.1

Vnitřní objem sudu je 15krát větší než objem kbelíku.\
Objem kbelíku je 5krát větší než objem konvičky. \
Ze sudu plného vody jsme třetinu vody odebrali, takže v něm zbylo 60 litrů vody.

**Vypočtěte v litrech objem konvičky.**

## 2.2

Kvádr je možné beze zbytku rozřezat na 200 krychlí, z nichž každá má objem 8 dm<sup>3</sup>.

**Vypočtěte, na kolik krychliček o objemu 1 cm<sup>3</sup> lze tento kvádr beze zbytku rozřezat.**

---`

  const parsedTree = markdownParser.parse(input);
  const rawHeadings = chunkHeadingsList(parsedTree, input);
  expect(rawHeadings.length).toBe(5);

})

test('parse tree markdown', () => {
  const input = `  
# 15 Přiřaďte ke každé úloze (15.1–15.3) odpovídající výsledek (A–F).

## 15.1 V roce 2020 firma vyrobila 250 výrobků.Jak v roce 2021, tak v roce 2022 vyrobila firma vždy o 20 % výrobků více nežv předchozím roce.

**Kolik výrobků vyrobila firma v roce 2022?**

## 15.2 Roman i Jana jezdili během dovolené na kole.Roman ujel 400 km, což bylo o čtvrtinu více, než ujela Jana.

**Kolik km ujela na kole během dovolené Jana?**

## 15.3 Firma během krize propouštěla zaměstnance,takže jich měla na konci krize o 40 % méně než před krizí.Když firma po odeznění krize přijala 42 nových zaměstnanců,měla jich o 25 % více než na konci krize.

**Kolik zaměstnanců měla firma před krizí?**

- [A] 280
- [B] 300
- [C] 320
- [D] 350
- [E] 360
- [F] jiný počet

 ---
  `


  const parsedTree = markdownParser.parse(input);
  const rawHeadings = chunkHeadingsList(parsedTree, input);

  //const tree = createTree(headings);


  //console.log(rawHeadings)
  expect(rawHeadings.length).toBe(4);

  function order(name: Maybe<string>) {
    if (name == Abbreviations.ST) return 1;
    if (name == Abbreviations.H1) return 2;
    if (name == Abbreviations.H2) return 3;
    return 0;
  }

  const headingsTree = createTree(rawHeadings.map(data => ({ data })), (child, potentionalParent) => order(child.type?.name) > order(potentionalParent.type?.name));

  expect(headingsTree.length).toBe(1);

  const headingLeafs = getAllLeafsWithAncestors({ data: {}, children: headingsTree });

  expect(headingLeafs.length).toBe(3);
  //console.log(headingLeafs)
  // console.log(headingLeafs[0].ancestors)

  // expect(headingLeafs[0].leaf.data.options.length).toBe(6);
  // expect(headingLeafs[1].leaf.data.options.length).toBe(6);
  expect(headingLeafs[2].leaf.data.options.length).toBe(6);


})


test('parse options', () => {
  const input = ` 
- [A] 280
- [B] 300
- [C] 320
- [D] 350
- [E] 360
- [F] jiný počet
  `


  const parsedTree = markdownParser.parse(input);
  const rawHeadings = chunkHeadingsList(parsedTree, input);

  expect(rawHeadings.length).toBe(1);
  expect(rawHeadings[0].options.length).toBe(6);
  expect(rawHeadings[0].options.map(d => d.value).join("")).toBe('ABCDEF');



})


test('parse to root questions', () => {

  const inputArr = [`VÝCHOZÍ TEXT K ÚLOZE 1-2
===

> Celý film trvá 1 hodinu. Doba, která ještě zbývá do konce filmu, je polovinou doby, která již uplynula od začátku filmu.
`,
`# 1
---
`,
`# 2
## 2.1

Vnitřní objem sudu je 15krát větší než objem kbelíku.\
Objem kbelíku je 5krát větší než objem konvičky. \
Ze sudu plného vody jsme třetinu vody odebrali, takže v něm zbylo 60 litrů vody.

**Vypočtěte v litrech objem konvičky.**

- [A] 280
- [B] 300
- [C] 320
- [D] 350
- [E] 360
- [F] jiný počet

## 2.2

Kvádr je možné beze zbytku rozřezat na 200 krychlí, z nichž každá má objem 8 dm<sup>3</sup>.

**Vypočtěte, na kolik krychliček o objemu 1 cm<sup>3</sup> lze tento kvádr beze zbytku rozřezat.**

---`];
  const input = inputArr.join("")
  const markdownParserWithoutOptions = parser.configure([[ShortCodeMarker], GFM, Subscript, Superscript]);
  const parsedTree = markdownParserWithoutOptions.parse(input);
  const quizBuilder = getQuizBuilder(parsedTree,input);
  expect(quizBuilder.questions.length).toBe(2)

  const quizIds = quizBuilder.questions.map(d => d.id);
  expect(quizIds).toStrictEqual([1,2])

  const output = quizBuilder.content(quizIds);
  expect(output).toBe(input)

  const question1 = quizBuilder.content([1]);
  const question2 = quizBuilder.content([2]);
  
  
  expect(question1).toBe(inputArr.slice(0,2).join(""))
  expect(question2).toBe([inputArr[0],inputArr[2]].join(""))


})

