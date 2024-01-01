import { createModel } from "@rematch/core";
import { RootModel } from ".";
import { ChildrenPoints, FormControl, FormGroup, Maybe } from "../utils/form.utils";

// create the custom validator function 

function equalValidator<T>(value: T) {
  return (control: FormControl<T>) => {
    // returns null if value is valid, or an error message otherwise 
    return control.value === value ? null : { '': 'This value is invalid' };
  }
}
function fractionEqualValidator(fraction: [number, number]) {
  return (control: FormControl<string>) => {
    // returns null if value is valid, or an error message otherwise 
    return control.value === `${fraction[0]}/${fraction[1]}` ? null : { '': 'This value is invalid' };
  }
}
function sum<T>(points: ChildrenPoints<T>) {
  return Object.entries(points).map(([, d]) => d as number).filter(d => d !== undefined).reduce((out, d) => out += d, 0);
}

// Usage
const form = new FormGroup({
  1: new FormControl<number>(undefined, equalValidator(20), {
    points: 1
  }),
  2: new FormGroup({
    2.1: new FormControl<number>(undefined, equalValidator(1.2), {
      poinst: 2, deductions: [[1, "Správná číselná hodnota je uvedena s chybnou jednotkou, např. 1,2 hodiny"]]
    }),
    2.2: new FormControl<number>(undefined, equalValidator(1_600_000), {
      poinst: 1
    })
  }),
  3: new FormGroup({
    3.1: new FormControl<string>(undefined, fractionEqualValidator([4, 9]), { points: 1 }),
    3.2: new FormControl<string>(undefined, fractionEqualValidator([-2, 7]), { points: 1 }),
    3.3: new FormControl<string>(undefined, fractionEqualValidator([5, 14]), {
      points: 2,
      deductions: [
        [1, `Postup řešení obsahuje právě jeden z následujících nedostatků:
- výsledný zlomek není v základním tvaru,
- jedna operace je provedena s numerickou chybou,
- teprve po uvedení správného výsledku je provedena nadbytečná chybná úprava.
`],
        [0, `Postup řešení obsahuje kterékoli z následujících nedostatků:
- je použita algoritmicky chybná operace se zlomky,
- číselný výraz je chybně upraven (např. je vynásoben společným jmenovatelem),
- řešení obsahuje více než jednu chybu.`
        ]]
    }),
    11: new FormGroup({
      11.1: new FormControl<boolean>(undefined, equalValidator(false)),
      11.2: new FormControl<boolean>(undefined, equalValidator(true)),
      11.3: new FormControl<boolean>(undefined, equalValidator(false)),
    }, points => {
      const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
      const succesAnswersCount = arr.filter(d => d).length;
      return succesAnswersCount === 0 ? 0 : succesAnswersCount === arr.length ? 2 : 1
    })
  })
});

// Simulate changes
form.controls[1].setValue(20);
form.controls[2].controls["2.1"].setValue(2)

//calculate points
console.log(form.controls[2].compute())
console.log(form.compute());