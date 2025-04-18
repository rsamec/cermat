import { AnswerGroup } from './utils/quiz-specification';
import M5A_2025 from './exams/M5A-2025';
import M5B_2025 from './exams/M5B-2025';
import M5A_2024 from './exams/M5A-2024';
import M5A_2023 from './exams/M5A-2023';
import M5B_2023 from './exams/M5B-2023';

import M7A_2025 from './exams/M7A-2025';
import M7B_2025 from './exams/M7B-2025';
import M7A_2024 from './exams/M7A-2024';
import M7A_2023 from './exams/M7A-2023';
import M7B_2023 from './exams/M7B-2023';

import M9I_2025 from './exams/M9I-2025';
import M9A_2025 from './exams/M9A-2025';
import M9B_2025 from './exams/M9B-2025';

import M9A_2024 from './exams/M9A-2024';
import M9B_2024 from './exams/M9B-2024';
import M9C_2024 from './exams/M9C-2024';
import M9D_2024 from './exams/M9D-2024';

import M9A_2023 from './exams/M9A-2023';
import M9B_2023 from './exams/M9B-2023';
import M9C_2023 from './exams/M9C-2023';
import M9D_2023 from './exams/M9D-2023';

import MMA_2023 from './exams/MMA-2023';
import MMB_2023 from './exams/MMB-2023';

import C5A_2024 from './exams/C5A-2024';
import C5A_2023 from './exams/C5A-2023';
import C5B_2023 from './exams/C5B-2023';

import C7A_2024 from './exams/C7A-2024';
import C7A_2023 from './exams/C7A-2023';

import C9A_2025 from './exams/C9A-2025';
import C9I_2025 from './exams/C9I-2025';

import C9A_2024 from './exams/C9A-2024';
import C9B_2024 from './exams/C9B-2024';
import C9C_2024 from './exams/C9C-2024';
import C9D_2024 from './exams/C9D-2024';
import C9A_2023 from './exams/C9A-2023';
import C9B_2023 from './exams/C9B-2023';
import C9C_2023 from './exams/C9C-2023';
import C9D_2023 from './exams/C9D-2023';
import CMA_2023 from './exams/CMA-2023';
import CMB_2023 from './exams/CMB-2023';
import CMA_2024 from './exams/CMA-2024';
import CMB_2024 from './exams/CMB-2024';

import AJA_2023 from './exams/AJA-2023';
import AJB_2023 from './exams/AJB-2023';
import AJA_2024 from './exams/AJA-2024';
import AJB_2024 from './exams/AJB-2024';

import DEA_2023 from './exams/DEA-2023';

const cz8Years = ["cz", "8"];
const cz4Years = ["cz", "4"];
const cz6Years = ["cz", "6"];
const czDimploma = ["cz", "diploma"];

const math8Years = ["math", "8"];
const math4Years = ["math", "4"];
const math6Years = ["math", "6"];
const mathDiploma = ["math", "diploma"];

const enDiploma = ["en", "diploma"]; ``
const deDiploma = ["de", "diploma"];
const frDiploma = ["fr", "diploma"];


const examTestCases: { quiz: AnswerGroup<any>, pathes: string[], config: { questions?: boolean, solver?: boolean } }[] = [
  // math
  { pathes: math8Years.concat("M5A-2025"), quiz: M5A_2025, config: { questions: true, solver: true } },
  { pathes: math8Years.concat("M5B-2025"), quiz: M5B_2025, config: { questions: true, solver: true } },
  { pathes: math8Years.concat("M5A-2024"), quiz: M5A_2024, config: { questions: true, solver: true } },
  { pathes: math8Years.concat("M5A-2023"), quiz: M5A_2023, config: { questions: true, solver: true } },
  { pathes: math8Years.concat("M5B-2023"), quiz: M5B_2023, config: { questions: false } },

  { pathes: math6Years.concat("M7A-2025"), quiz: M7A_2025, config: { questions: true, solver: true } },
  { pathes: math6Years.concat("M7B-2025"), quiz: M7B_2025, config: { questions: true, solver: true } },
  { pathes: math6Years.concat("M7A-2024"), quiz: M7A_2024, config: { questions: true, solver: true } },
  { pathes: math6Years.concat("M7A-2023"), quiz: M7A_2023, config: { questions: true, solver: true } },
  { pathes: math6Years.concat("M7B-2023"), quiz: M7B_2023, config: { questions: false } },

  { pathes: math4Years.concat("M9I-2025"), quiz: M9I_2025, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9A-2025"), quiz: M9A_2025, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9B-2025"), quiz: M9B_2025, config: { questions: true, solver: false } },

  { pathes: math4Years.concat("M9A-2024"), quiz: M9A_2024, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9B-2024"), quiz: M9B_2024, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9C-2024"), quiz: M9C_2024, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9D-2024"), quiz: M9D_2024, config: { questions: true, solver: false } },

  { pathes: math4Years.concat("M9A-2023"), quiz: M9A_2023, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9B-2023"), quiz: M9B_2023, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9C-2023"), quiz: M9C_2023, config: { questions: true, solver: false } },
  { pathes: math4Years.concat("M9D-2023"), quiz: M9D_2023, config: { questions: true, solver: false } },

  { pathes: mathDiploma.concat("MMA-2023"), quiz: MMA_2023, config: { questions: true } },
  { pathes: mathDiploma.concat("MMB-2023"), quiz: MMB_2023, config: { questions: true } },

  // czech
  { pathes: cz8Years.concat("C5A-2024"), quiz: C5A_2024, config: { questions: true, solver: true } },
  { pathes: cz8Years.concat("C5A-2023"), quiz: C5A_2023, config: { questions: true, solver: true } },
  { pathes: cz8Years.concat("C5B-2023"), quiz: C5B_2023, config: { questions: true, solver: true } },

  { pathes: cz6Years.concat("C7A-2024"), quiz: C7A_2024, config: { questions: true, solver: true } },
  { pathes: cz6Years.concat("C7A-2023"), quiz: C7A_2023, config: { questions: true, solver: true } },

  { pathes: cz4Years.concat("C9I-2025"), quiz: C9I_2025, config: { questions: true, solver: false} },
  { pathes: cz4Years.concat("C9A-2025"), quiz: C9A_2025, config: { questions: true, solver: false} },
  
  { pathes: cz4Years.concat("C9A-2024"), quiz: C9A_2024, config: { questions: true, solver: false} },
  { pathes: cz4Years.concat("C9B-2024"), quiz: C9B_2024, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9C-2024"), quiz: C9C_2024, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9D-2024"), quiz: C9D_2024, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9A-2023"), quiz: C9A_2023, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9B-2023"), quiz: C9B_2023, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9C-2023"), quiz: C9C_2023, config: { questions: true, solver: false } },
  { pathes: cz4Years.concat("C9D-2023"), quiz: C9D_2023, config: { questions: true, solver: false } },
  

  { pathes: czDimploma.concat("CMA-2023"), quiz: CMA_2023, config: { questions: true, solver: false } },
  { pathes: czDimploma.concat("CMB-2023"), quiz: CMB_2023, config: { questions: true, solver: false } },
  { pathes: czDimploma.concat("CMA-2024"), quiz: CMA_2024, config: { questions: true, solver: true } },
  { pathes: czDimploma.concat("CMB-2024"), quiz: CMB_2024, config: { questions: true, solver: true } },

  // english  
  { pathes: enDiploma.concat("AJA-2023"), quiz: AJA_2023, config: { questions: true, solver: false } },
  { pathes: enDiploma.concat("AJB-2023"), quiz: AJB_2023, config: { questions: true, solver: false } },
  { pathes: enDiploma.concat("AJA-2024"), quiz: AJA_2024, config: { questions: true, solver: false } },
  { pathes: enDiploma.concat("AJB-2024"), quiz: AJB_2024, config: { questions: true, solver: false } },

  // german  
  { pathes: deDiploma.concat("DEA-2023"), quiz: DEA_2023, config: { questions: true, solver: false } },

  // french  
  //{ pathes: frDiploma.concat("FRA-2023"), quiz: aja_2023, config:{questions:true} },

]
export default examTestCases;