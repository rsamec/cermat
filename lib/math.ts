import { AnswerBuilder } from "./utils/form-answers";
import { CoreValidators } from "./utils/validators";

const form = AnswerBuilder.group({
  1: { verifyBy: CoreValidators.EqualValidator(20), points: 1, inputType: 'number' },
  2: AnswerBuilder.group({
    2.1: { verifyBy: CoreValidators.EqualValidator(20), points: 2, },
    2.2: { verifyBy: CoreValidators.EqualValidator(1_600_000), points: 1,},
  }),
  3: AnswerBuilder.group({     
    3.1: { verifyBy: CoreValidators.FractionEqualValidator([4, 9]), points: 1 },
    3.2: { verifyBy: CoreValidators.FractionEqualValidator([-2, 7]), points: 1 },
    3.3: {
      verifyBy: CoreValidators.FractionEqualValidator([5, 14]),
      points: 2,
    }
  }),   
  11: AnswerBuilder.group({
    11.1: { verifyBy: CoreValidators.EqualOptionValidator(false), },
    11.2: { verifyBy: CoreValidators.EqualOptionValidator(true) },
    11.3: { verifyBy: CoreValidators.EqualOptionValidator(false) },
  }, {
    compute: (points) => {
      const arr = Object.entries(points).map(([, d]) => d);
      const succesAnswersCount = arr.filter(d => d).length;
      return succesAnswersCount === 0 ? 0 : succesAnswersCount === arr.length ? 2 : 1
    }
  }),
  12: { verifyBy: CoreValidators.EqualOptionValidator("B"), points: 1 },
});

export default form;