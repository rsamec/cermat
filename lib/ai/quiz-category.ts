import OpenAI from "openai";
import { loadMarkdownWithAbsoluteImagesUrl } from "../utils/file.utils";
import { QuizCategoriesFileSaver } from "./file.utils";
import examTestCases from "../exams.utils";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ShortCodeMarker, getQuizBuilder } from "../utils/parser.utils";
import { parser, GFM, Subscript, Superscript } from '@lezer/markdown';
import { chunk } from "../utils/utils";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
//const modelName = "gpt-4o-2024-08-06";
const modelName = "gpt-4o";

const markdownParser = parser.configure([[ShortCodeMarker], GFM, Subscript, Superscript]);

const MathQuestion = z.object({
  id: z.string(),
  category: z.enum([
    "NUMBER_OPERATIONS",
    "NUM_EXPRESSIONS",
    "VARIABLE_EXPRESSIONS",
    "UNIT_CONVERSIONS",
    "POLYNOMIALS",
    "LINEAR_EQUATIONS",
    "WORD_PROBLEMS",
    "GRAPHS_SCHEMES_TABLES",
    "PROPORTIONS",
    "RATIOS_MAPS",
    "PERCENTAGES",
    "PYTHAGORAS_THEOREM",
    "PLANE_GEOMETRY",
    "SOLID_GEOMETRY",
    "CONSTRUCTION_PROBLEMS",
    "APPLICATION_PROBLEMS",
    "SYMMETRY"])
});
const MathCategories = z.object({
  questions: z.array(MathQuestion)
})

const CzQuestion = z.object({
  id: z.string(),
  category: z.enum([
    "LITERARY_TEXT_UNDERSTANDING",
    "NON_LITERARY_TEXT_UNDERSTANDING",
    "WORK_WITH_DEFINITION",
    "TEXT_COHERENCE",
    "STYLE",
    "SPELLING_RULES_CLOSED",
    "SPELLING_RULES_OPEN",
    "WORD_MEANING_RELATIONS",
    "EMOTIVE_WORDS_FORMALITY",
    "FIXED_EXPRESSIONS",
    "PHONETICS_WORD_STRUCTURE",
    "RELATED_WORDS",
    "SENTENCE_MEMBERS_SUBORDINATE_CLAUSES",
    "SENTENCE_CONSTRUCTION",
    "DIRECT_INDIRECT_SPEECH",
    "PARTS_OF_SPEECH",
    "GRAMMATICAL_CATEGORIES",
    "WORD_FORMS",
    "LITERATURE"
  ])
});
const CzCategories = z.object({
  questions: z.array(CzQuestion)
})



const mathCategories = {
  NUMBER_OPERATIONS: "Číslo a početní operace",
  NUM_EXPRESSIONS: "Číselné výrazy, zlomky, desetinná čísla, mocniny",
  VARIABLE_EXPRESSIONS: "Výrazy s proměnnou",
  UNIT_CONVERSIONS: "Převody jednotek",
  POLYNOMIALS: "Počítání s mnohočleny",
  LINEAR_EQUATIONS: "Lineární rovnice, soustavy rovnic",
  WORD_PROBLEMS: "Slovní úlohy na číselné obory, rovnice a jejich soustavy",
  GRAPHS_SCHEMES_TABLES: "Grafy, schémata, tabulky",
  PROPORTIONS: "Přímá, nepřímá úměrnost",
  RATIOS_MAPS: "Poměr, mapa",
  PERCENTAGES: "Procenta",
  PYTHAGORAS_THEOREM: "Pythagorova věta",
  PLANE_GEOMETRY: "Geometrie v rovině",
  SOLID_GEOMETRY: "Geometrie v prostoru",
  CONSTRUCTION_PROBLEMS: "Konstrukční úlohy",
  APPLICATION_PROBLEMS: "Aplikační úlohy netypicky zadané",
  SYMMETRY: "Osová, středová souměrnost"
};

const czCategories = {
  LITERARY_TEXT_UNDERSTANDING: "Porozumění uměleckému textu",
  NON_LITERARY_TEXT_UNDERSTANDING: "Porozumění neuměleckému textu",
  WORK_WITH_DEFINITION: "Práce s definicí",
  TEXT_COHERENCE: "Textová návaznost",
  STYLE: "Sloh",
  SPELLING_RULES_CLOSED: "Pravidla českého pravopisu: uzavřené úlohy",
  SPELLING_RULES_OPEN: "Pravidla českého pravopisu: otevřené úlohy",
  WORD_MEANING_RELATIONS: "Význam slov a významové vztahy",
  EMOTIVE_WORDS_FORMALITY: "Citově zabarvená slova, spisovnost/nespisovnost",
  FIXED_EXPRESSIONS: "Ustálená slovní spojení",
  PHONETICS_WORD_STRUCTURE: "Hlásky a stavba slov",
  RELATED_WORDS: "Slova příbuzná",
  SENTENCE_MEMBERS_SUBORDINATE_CLAUSES: "Větné členy, vedlejší věty, významové poměry",
  SENTENCE_CONSTRUCTION: "Výstavba věty jednoduché a souvětí",
  DIRECT_INDIRECT_SPEECH: "Přímá/nepřímá řeč",
  PARTS_OF_SPEECH: "Slovní druhy",
  GRAMMATICAL_CATEGORIES: "Mluvnické kategorie",
  WORD_FORMS: "Tvary slov",
  LITERATURE: "Literatura"
}

interface CategoryQuestions  { questions: { id: string, category: string }[]}

export async function main() {

  const usePaidApi = false;
  const client = usePaidApi ? new OpenAI({
      organization: "org-u9Q9NxhzuntTO1rgjfl2Kkaq",
      project: "proj_3AmxUiUlFDCV0xxQD5DteczY",
  }): new OpenAI({ baseURL: endpoint, apiKey: token });

  const storage = new QuizCategoriesFileSaver({ model: modelName });
  let filtredQuizTestCase = examTestCases.filter(d => d.config.questions && (d.pathes[0] == 'cz' || d.pathes[0] == 'math') && !storage.containsKey(d.pathes[2]));  
  console.log(filtredQuizTestCase.map(d => d.pathes));
  console.log(`Total tests: ${examTestCases.length}, filtred: ${filtredQuizTestCase.length}`);
  
  
  for (let quizTestCase of filtredQuizTestCase) {
    const { pathes } = quizTestCase;
    const [subject, grade, code] = pathes;

    //load quiz
    const quizContent = await loadMarkdownWithAbsoluteImagesUrl(pathes);

    //parse quiz questions
    const contentTree = markdownParser.parse(quizContent);
    const quizBuilder = getQuizBuilder(contentTree, quizContent);

    const questionChunks = chunk(quizBuilder.questions.map(d => d.id), 16);
    console.log("Questions", questionChunks);

    var categoriesResult: CategoryQuestions = { questions: [] }

    for await (let questionChunk of questionChunks) {

      const quizContent = quizBuilder.content(questionChunk);

      const response = await client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "system", content: `You are an expert at classifying ${subject} subject. You will be given quiz with questions.
         The quiz format is markdown text. Each question is identified by markdown headings. Some question can have sub questions.
        - # heading is root questions - question id is idenfied by format # {number}
        - ## heading is sub questions - question id is idenfied by format ## {number}.{number}
         `
          },
          {
            role: 'assistant',
            content: `
          category list
          ${Object.entries(subject == "math" ? mathCategories : subject == "cz" ? czCategories : {}).map(([key, value]) => `- ${key}:"${value}",\n`)}`
          },
          {
            role: "user", content: [
              { type: "text", text: `Assign category to each root question in a quiz. Do not assign category to sub questions.`},
                //Return json format. Array of categories for each root question, e.g.[{"id": "1","category": "WORD_PROBLEMS"}, {"id": "2","category": "SOLID_GEOMETRY"}]` },
              { type: "text", text: quizContent },

            ]
          },
        ],
        response_format: zodResponseFormat(subject == "math" ? MathCategories : CzCategories, "quiz"),
        //response_format: { "type": "json_object" },
        temperature: 1.,
        max_tokens: 1000,
        top_p: 1.
      });

      const result = response.choices[0].message.content;

      if (result != null) {

        const parsedResult = JSON.parse(result) as CategoryQuestions
        categoriesResult = { questions: categoriesResult.questions.concat(parsedResult.questions) }
        console.log(pathes, Object.values(categoriesResult))
        storage.updateJSONFile(code, categoriesResult)
      }
      else {
        console.log(response)
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});