/**
 * Light Angels Primary School
 * Institutional Grading System Specifications:
 * 
 * 1. UPPER PRIMARY (P.4 to P.7):
 *    Official UNEB 9-Point Grading Scale:
 *    - 90 - 100%: D1 (Distinction 1, Grading point: 1)
 *    - 80 - 89%:  D2 (Distinction 2, Grading point: 2)
 *    - 70 - 79%:  C3 (Credit 3, Grading point: 3)
 *    - 60 - 69%:  C4 (Credit 4, Grading point: 4)
 *    - 55 - 59%:  C5 (Credit 5, Grading point: 5)
 *    - 50 - 54%:  C6 (Credit 6, Grading point: 6)
 *    - 45 - 49%:  P7 (Pass 7, Grading point: 7)
 *    - 40 - 44%:  P8 (Pass 8, Grading point: 8)
 *    - 0 - 39%:   F9 (Fail 9, Grading point: 9)
 * 
 *    AGGREGATE CALCULATION FOR UPPER CLASSES (P.4 to P.7):
 *    We add the total grading (grade points: 1 to 9) for EACH subject to get the student's Aggregate.
 *    For example: English D2(2) + SST D1(1) + Science C3(3) + Math D2(2) = 2 + 1 + 3 + 2 = 8 Aggregates.
 *    The PLE Division is then determined directly from this total Aggregate:
 *    - Division 1: Total Aggregate 4 – 12 (with no F9 in core subjects)
 *    - Division 2: Total Aggregate 13 – 23 (with no F9 in core subjects)
 *    - Division 3: Total Aggregate 24 – 29
 *    - Division 4: Total Aggregate 30 – 34
 *    - Division U: Total Aggregate 35 – 36 (Ungraded remedial)
 * 
 * 2. LOWER PRIMARY (P.1 to P.3):
 *    "We use total in lower classes for grading"
 *    Pupils take 6 learning areas (Luganda, English, Mathematics, Reading, Literacy One, Literacy 2),
 *    each marked out of 100 (Total possible marks: 600).
 *    Grading and ranking are determined directly by the pupil's TOTAL MARKS scored:
 *    - Grade I  (First Grade):  Total 480 - 600 (80% - 100%) - Distinction Total Performance
 *    - Grade II (Second Grade): Total 360 - 479 (60% - 79%)  - High Credit Total Performance
 *    - Grade III (Third Grade): Total 300 - 359 (50% - 59%)  - Satisfactory Pass Total Performance
 *    - Grade IV (Fourth Grade): Total 240 - 299 (40% - 49%)  - Marginal Pass Total Performance
 *    - Grade U  (Ungraded):     Total 0 - 239   (0% - 39%)   - Remedial Support Required
 */

export interface UgandanGradeInfo {
  grade: 'D1' | 'D2' | 'C3' | 'C4' | 'C5' | 'C6' | 'P7' | 'P8' | 'F9';
  label: string;
  points: number;
  descriptor: string;
  badgeClass: string;
  minMark: number;
  maxMark: number;
}

export interface LowerPrimaryGradeInfo {
  grade: 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV' | 'Grade U';
  label: string;
  descriptor: string;
  badgeClass: string;
  minPct: number;
  maxPct: number;
  minTotalFor600: number;
  maxTotalFor600: number;
}

/**
 * Upper Primary (P.4 - P.7) UNEB standard 9-point scale reference
 */
export const UPPER_PRIMARY_GRADING_SCALE: UgandanGradeInfo[] = [
  {
    grade: 'D1',
    label: 'Distinction 1',
    points: 1,
    descriptor: 'Exemplary Mastery & Precision',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    minMark: 90,
    maxMark: 100
  },
  {
    grade: 'D2',
    label: 'Distinction 2',
    points: 2,
    descriptor: 'Very Good Conceptual Understanding',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    minMark: 80,
    maxMark: 89
  },
  {
    grade: 'C3',
    label: 'Credit 3',
    points: 3,
    descriptor: 'Good Competence & Skill Application',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    minMark: 70,
    maxMark: 79
  },
  {
    grade: 'C4',
    label: 'Credit 4',
    points: 4,
    descriptor: 'Satisfactory Analytical Competence',
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200',
    minMark: 60,
    maxMark: 69
  },
  {
    grade: 'C5',
    label: 'Credit 5',
    points: 5,
    descriptor: 'Fair Subject Competence',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    minMark: 55,
    maxMark: 59
  },
  {
    grade: 'C6',
    label: 'Credit 6',
    points: 6,
    descriptor: 'Adequate Basic Competence',
    badgeClass: 'bg-sky-50 text-sky-600 border-sky-200',
    minMark: 50,
    maxMark: 54
  },
  {
    grade: 'P7',
    label: 'Pass 7',
    points: 7,
    descriptor: 'Basic Pass / Routine Recall',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    minMark: 45,
    maxMark: 49
  },
  {
    grade: 'P8',
    label: 'Pass 8',
    points: 8,
    descriptor: 'Weak Pass / Needs Regular Reinforcement',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    minMark: 40,
    maxMark: 44
  },
  {
    grade: 'F9',
    label: 'Fail 9',
    points: 9,
    descriptor: 'Needs Intensive Remedial Support',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    minMark: 0,
    maxMark: 39
  }
];

/**
 * Lower Primary (P.1 - P.3) Total Marks Grading Scale reference
 */
export const LOWER_PRIMARY_TOTAL_GRADING_SCALE: LowerPrimaryGradeInfo[] = [
  {
    grade: 'Grade I',
    label: 'First Grade (Distinction)',
    descriptor: 'Outstanding composite score across all lower primary learning areas',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    minPct: 80,
    maxPct: 100,
    minTotalFor600: 480,
    maxTotalFor600: 600
  },
  {
    grade: 'Grade II',
    label: 'Second Grade (Credit)',
    descriptor: 'Commendable aggregate total score demonstrating solid mastery',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    minPct: 60,
    maxPct: 79,
    minTotalFor600: 360,
    maxTotalFor600: 479
  },
  {
    grade: 'Grade III',
    label: 'Third Grade (Pass)',
    descriptor: 'Satisfactory composite total meeting core basic competencies',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    minPct: 50,
    maxPct: 59,
    minTotalFor600: 300,
    maxTotalFor600: 359
  },
  {
    grade: 'Grade IV',
    label: 'Fourth Grade (Marginal Pass)',
    descriptor: 'Marginal total performance requiring guided supervision',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    minPct: 40,
    maxPct: 49,
    minTotalFor600: 240,
    maxTotalFor600: 299
  },
  {
    grade: 'Grade U',
    label: 'Ungraded (Remedial)',
    descriptor: 'Total score below passing threshold; daily tutoring advised',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    minPct: 0,
    maxPct: 39,
    minTotalFor600: 0,
    maxTotalFor600: 239
  }
];

/**
 * Checks if a class is in Upper Primary (P.4 to P.7)
 */
export function isUpperPrimary(gradeStr: string): boolean {
  return ['P.4', 'P.5', 'P.6', 'P.7'].includes(gradeStr);
}

/**
 * Checks if a class is in Lower Primary (P.1 to P.3)
 */
export function isLowerPrimary(gradeStr: string): boolean {
  return ['P.1', 'P.2', 'P.3'].includes(gradeStr);
}

/**
 * Calculates UNEB Primary Grade from percentage (0-100)
 * Scale:
 * 90 - 100: D1
 * 80 - 89:  D2
 * 70 - 79:  C3
 * 60 - 69:  C4
 * 55 - 59:  C5
 * 50 - 54:  C6
 * 45 - 49:  P7
 * 40 - 44:  P8
 * 0 - 39:   F9
 */
export function getUgandanGrade(pct: number): UgandanGradeInfo {
  const rounded = Math.round(pct);
  if (rounded >= 90) return UPPER_PRIMARY_GRADING_SCALE[0]; // D1
  if (rounded >= 80) return UPPER_PRIMARY_GRADING_SCALE[1]; // D2
  if (rounded >= 70) return UPPER_PRIMARY_GRADING_SCALE[2]; // C3
  if (rounded >= 60) return UPPER_PRIMARY_GRADING_SCALE[3]; // C4
  if (rounded >= 55) return UPPER_PRIMARY_GRADING_SCALE[4]; // C5
  if (rounded >= 50) return UPPER_PRIMARY_GRADING_SCALE[5]; // C6
  if (rounded >= 45) return UPPER_PRIMARY_GRADING_SCALE[6]; // P7
  if (rounded >= 40) return UPPER_PRIMARY_GRADING_SCALE[7]; // P8
  return UPPER_PRIMARY_GRADING_SCALE[8]; // F9 (0 - 39)
}

/**
 * Calculates Lower Primary Grade based on TOTAL MARKS (P.1 - P.3)
 * @param totalScore The sum of marks scored across all subjects (e.g. 540)
 * @param maxPossibleTotal The maximum possible total marks (e.g. 600 for 6 subjects)
 */
export function getLowerPrimaryTotalGrade(
  totalScore: number,
  maxPossibleTotal: number = 600
): LowerPrimaryGradeInfo & { totalPercentage: number; totalScore: number; maxPossibleTotal: number } {
  const safeMax = maxPossibleTotal > 0 ? maxPossibleTotal : 600;
  const pct = Math.round((totalScore / safeMax) * 100);

  let match = LOWER_PRIMARY_TOTAL_GRADING_SCALE[4]; // Default Grade U
  if (pct >= 80) match = LOWER_PRIMARY_TOTAL_GRADING_SCALE[0];
  else if (pct >= 60) match = LOWER_PRIMARY_TOTAL_GRADING_SCALE[1];
  else if (pct >= 50) match = LOWER_PRIMARY_TOTAL_GRADING_SCALE[2];
  else if (pct >= 40) match = LOWER_PRIMARY_TOTAL_GRADING_SCALE[3];

  return {
    ...match,
    totalPercentage: pct,
    totalScore,
    maxPossibleTotal: safeMax
  };
}

/**
 * Calculates PLE Division and Aggregate for Upper Primary (P.4 to P.7)
 * Rule: For upper classes we add total grading for each subject to get aggregate.
 * (e.g. D1=1, D2=2, C3=3, C4=4, C5=5, C6=6, P7=7, P8=8, F9=9)
 * Total Aggregate = Sum of grading points across each subject.
 */
export function calculateUgandanDivision(grades: { points: number; grade: string; subjectName?: string }[]): {
  aggregate: number;
  division: 'Division 1' | 'Division 2' | 'Division 3' | 'Division 4' | 'Division U' | 'Pending';
  description: string;
  badgeClass: string;
  breakdown: string;
  detailedFormula: string;
} {
  if (grades.length === 0) {
    return {
      aggregate: 0,
      division: 'Pending',
      description: '0 subjects recorded',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      breakdown: '-',
      detailedFormula: '-'
    };
  }

  // For upper classes, add total grading (points) for each subject to get aggregate
  const aggregate = grades.reduce((acc, g) => acc + g.points, 0);
  const hasF9 = grades.some((g) => g.points === 9);

  const breakdown = grades
    .map((g) => `${g.subjectName ? g.subjectName + ' ' : ''}${g.grade}(${g.points})`)
    .join(' + ') + ` = ${aggregate} Aggregates`;

  const detailedFormula = grades.map((g) => `${g.points}`).join(' + ') + ` = ${aggregate}`;

  if (grades.length < 4) {
    return {
      aggregate,
      division: 'Pending',
      description: `${grades.length}/4 subjects recorded (Current Aggregate: ${aggregate})`,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      breakdown,
      detailedFormula
    };
  }

  if (aggregate >= 4 && aggregate <= 12 && !hasF9) {
    return {
      aggregate,
      division: 'Division 1',
      description: 'First Grade (Distinction Performance)',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      breakdown,
      detailedFormula
    };
  }
  if (aggregate >= 13 && aggregate <= 23 && !hasF9) {
    return {
      aggregate,
      division: 'Division 2',
      description: 'Second Grade (Credit Level Performance)',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      breakdown,
      detailedFormula
    };
  }
  if (aggregate >= 24 && aggregate <= 29) {
    return {
      aggregate,
      division: 'Division 3',
      description: 'Third Grade (Pass Level Performance)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      breakdown,
      detailedFormula
    };
  }
  if (aggregate >= 30 && aggregate <= 34) {
    return {
      aggregate,
      division: 'Division 4',
      description: 'Fourth Grade (Marginal Pass)',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      breakdown,
      detailedFormula
    };
  }
  return {
    aggregate,
    division: 'Division U',
    description: 'Ungraded (Immediate Academic Remediation Required)',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    breakdown,
    detailedFormula
  };
}

/**
 * Competence descriptor for Lower Primary individual subjects (P.1 - P.3)
 */
export function getLowerPrimaryCompetence(pct: number): {
  level: 'Level 3' | 'Level 2' | 'Level 1';
  descriptor: string;
  badgeClass: string;
} {
  if (pct >= 75) {
    return {
      level: 'Level 3',
      descriptor: 'Mastered / Exceeding Expectations',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
  if (pct >= 50) {
    return {
      level: 'Level 2',
      descriptor: 'Developing / Satisfactory',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    };
  }
  return {
    level: 'Level 1',
    descriptor: 'Emerging / Needs Regular Practice',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
  };
}
