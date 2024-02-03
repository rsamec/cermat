import { expect, test } from 'vitest';
import { cls, extractNumberRange, extractOptionRange, matchNumberListCount, normalizeText, removeLinesMatchingValues, removeMultipleLinesMathingLastValue, strToSimpleHtml } from './utils';

test('simple string', () => {

  expect(cls(["one"])).toBe("one")
  expect(cls(["one", "two"])).toBe("one two")
})

test('ternary operator', () => {
  expect(cls([true ? "one" : "two"])).toBe("one");
  expect(cls([false ? "one" : "two"])).toBe("two");

})
test('boolean to string', () => {
  expect(cls([true && "one"])).toBe("one")
  expect(cls([false && "one"])).toBe("")
})

test('extract number range identifier', () => {
  expect(extractNumberRange(
    `Some text 8-12
  ===`
  )).toEqual([8, 12])

})
test('extract number range identifier', () => {
  expect(extractNumberRange(
    `Some text 8–12
  ===`
  )).toEqual([8, 12])

})

test('extract option identifier', () => {
  expect(extractOptionRange("[A] some text")).toEqual(["A", "some text"])

})


test('simple convert string to super script', () => {
  expect(strToSimpleHtml("x^a + 2^")).toEqual("x<sup>a + 2</sup>")
  expect(strToSimpleHtml("some prefix x^a + 2^ some suffix")).toEqual("some prefix x<sup>a + 2</sup> some suffix")
})

test('extract option identifier', () => {
  expect(matchNumberListCount("1")).toEqual("# 1")
  expect(matchNumberListCount("1.2")).toEqual("## 1.2")
  expect(matchNumberListCount("1.2.3")).toEqual("### 1.2.3")
  expect(matchNumberListCount("22.22")).toEqual("## 22.22")

  expect(matchNumberListCount(" 1")).toEqual("# 1")
  expect(matchNumberListCount("  1.2")).toEqual("## 1.2")
  expect(matchNumberListCount("a 1")).toEqual("a 1")
  expect(matchNumberListCount("b  1.2")).toEqual("b  1.2")


})
test('remove lines matching values', () => {
  expect(removeLinesMatchingValues(" max. 2 body", ['max. 2 body'])).toEqual("")
  expect(removeLinesMatchingValues("  max. 2 body  ", ['max. 2 body'])).toEqual("")
})


const text = `123

Veřejně nepřístupná informace podle § 60b odst. 3 a § 80b školského zákona
456

Veřejně nepřístupná informace podle § 60b odst. 3 a § 80b školského zákona
789`
test('remove multiple lines matching value', () => {
  const expr = 'Veřejně nepřístupná informace podle § 60b odst. 3 a § 80b školského zákona'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  console.log(expr);
  expect(removeMultipleLinesMathingLastValue(text,expr)).toBe("\n\n789")
})

// test('e', () => {

//   const regex = /^\d+\s*$(?:\r?\n|^)\s*abcd\s*$/gm;
//   const matches = text.match(regex);
  
//   expect(text.replace(regex,"")).toBe("\n\n789")  
  
// })





// test('extract option identifier', () => {
//   const input = `
//   VÝCHOZÍ TEXTY K ÚLOHÁM 19–23
//   6 Přiřaďte k jednotlivým větám (6.1–6.3) odpovídající tvrzení (A–E).
//   (Větné členy mohou být ve větách uvedeny v libovolném pořadí. Žádnou možnost
//   z nabídky A–E nelze přiřadit víckrát než jednou.)
//   6.1 Někdo sestře poslal milostný dopis.
//   6.2 Učebnice angličtiny dostanou žáci později.
//   6.3 Příchozí ochotně podepsali prezenční listiny.
//   A) Věta obsahuje podmět, přísudek, přívlastek shodný a dva předměty.
//   B) Věta obsahuje podmět, přísudek, přívlastek neshodný a dva předměty.
//   C) Věta obsahuje podmět, přísudek, dva přívlastky shodné a příslovečné určení.
//   D) Věta obsahuje podmět, přísudek, přívlastek shodný, předmět a příslovečné určení.
//   E) Věta obsahuje podmět, přísudek, přívlastek neshodný, předmět a příslovečné určení.
//   max. 2 body
//   7 Ke každé z následujících podúloh (7.1 a 7.2) napište současné (tj. ne zastaralé)
//   spisovné slovo, které odpovídá zadání a zároveň není vlastním jménem.
//   7.1 Napište podstatné jméno, které je v 1. pádě čísla jednotného jednoslabičné,
//   je příbuzné se slovem ŘÍKAT, skloňuje se podle vzoru KOST a neobsahuje předponu.
//   7.2 Napište podstatné jméno, které je v 1. pádě čísla jednotného tříslabičné, je příbuzné
//   se slovem ROVNAT, skloňuje se podle vzoru STAVENÍ a obsahuje předponu.
//   4
//   `

//   const result = normalizeText(input);
//   console.log(result);
//   expect(result).toEqual('')

// })

