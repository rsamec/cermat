'use client'
import * as React from "react";
import IconToggleButtonGroup from "../core/IconToggleButtonGroup";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSquareRootVariable, faBookTanakh } from "@fortawesome/free-solid-svg-icons"
import { GradeType, SubjectType } from "../utils/exam";

const subjectOptions: { code: SubjectType, label: string, icon: ReactNode }[] = [
  { code: 'math', label: 'matika', icon: <FontAwesomeIcon icon={faSquareRootVariable} /> },
  { code: 'cz', label: 'čeština', icon: <FontAwesomeIcon icon={faBookTanakh} /> }]

const gradeOptions: { code: GradeType, label: string }[] = [
  { code: '8', label: 'osmileté' },
  { code: '6', label: 'šestileté' },
  { code: '4', label: 'čtyřleté' },
  { code: 'diploma', label: 'maturita' }
]

export default function SearchForm() {
  const [selectedSubject, setSelectedSubject] = useState<{ code: string, label: string, icon: ReactNode }>();
  const [selectedGrade, setSelectedGrade] = useState<{ code: string, label: string }>();
  return (
    <div className="p-4 max-w-max bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <div>
          <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Předmět
          </div>
          <IconToggleButtonGroup value={selectedSubject} options={subjectOptions} isSame={(f, s) => f?.code === s?.code} format={option => option.label} icon={option => option.icon} onChange={(d) => setSelectedSubject(d)}></IconToggleButtonGroup>
        </div>
        <div>
          <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Varianta studia
          </div>
          <IconToggleButtonGroup value={selectedGrade} options={gradeOptions} isSame={(f, s) => f?.code === s?.code} format={option => option.label} onChange={(d) => setSelectedGrade(d)}></IconToggleButtonGroup>
        </div>
        <div className="self-end">
          <Link href={`timeline/${selectedSubject?.code}/${selectedGrade?.code}`}><button disabled={selectedSubject == null || selectedGrade == null}
            className="btn btn-blue flex items-center gap-2"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>Najít</button></Link>
        </div>
      </div>
    </div>
  )
}
