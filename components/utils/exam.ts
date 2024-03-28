export type SubjectType = 'cz' | 'math' | 'en' | 'de' | 'fr' | 'es' | 'ru';
export type GradeType = '4' | '6' | '8' | 'diploma';
export type ExamMetadata = {
  subject: SubjectType
  grade: GradeType
  year: string
  code: string
  expectedAt: string
}

export const subjectLabel = (value: SubjectType) => {
  if (value === "math") return "matika"
  else if (value === "cz") return "čeština"
  else if (value === "en") return "angličtina"
  else if (value === "de") return "němčina"
  else if (value === "fr") return "francouzština"
  else if (value === "es") return "španělština"
  else if (value === "ru") return "ruština"
  return value;
}
export const gradeLabel = (value: GradeType) => {
  if (value === "4") return "čtyřleté";
  else if (value === "6") return "šestileté"
  else if (value === "8") return "osmileté";
  else if (value ==="diploma") return "maturita";
  return value
}

export const toTags = (d: Partial<ExamMetadata>, projection: string[]) => {
  return [    
    ...(projection.indexOf('year') !== -1 && d.year ? [{ value: d.year, label: d.year }] : []),
    ...(projection.indexOf('subject') !== -1 && d.subject ? [{ value: d.subject, label: subjectLabel(d.subject) }] : []),
    ...(projection.indexOf('grade') !== -1 && d.grade ? [{ value: d.grade, label: gradeLabel(d.grade) }] : []),
  ]
}
