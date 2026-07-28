export type GradeComponents = {
  assignmentScore: number | null;
  midtermScore: number | null;
  finalScore: number | null;
  bonusScore: number | null;
  assignmentWeight: number;
  midtermWeight: number;
  finalWeight: number;
};

export type GradeResult = {
  averageScore: number | null;
  letterGrade: string | null;
  mention: string | null;
};

/**
 * Calcule la moyenne ponderee d'un etudiant.
 * Les 3 composantes (devoir/partiel/final) doivent toutes etre saisies pour calculer une moyenne.
 * Le bonus s'ajoute apres ponderation, plafonne a 20.
 */
export function computeGradeAverage(components: GradeComponents): GradeResult {
  const { assignmentScore, midtermScore, finalScore, bonusScore, assignmentWeight, midtermWeight, finalWeight } = components;

  if (assignmentScore === null || midtermScore === null || finalScore === null) {
    return { averageScore: null, letterGrade: null, mention: null };
  }

  const totalWeight = assignmentWeight + midtermWeight + finalWeight;
  if (totalWeight === 0) {
    return { averageScore: null, letterGrade: null, mention: null };
  }

  const weighted =
    (assignmentScore * assignmentWeight + midtermScore * midtermWeight + finalScore * finalWeight) / totalWeight;

  const withBonus = Math.min(20, weighted + (bonusScore ?? 0));
  const averageScore = Math.round(withBonus * 100) / 100;

  return {
    averageScore,
    letterGrade: getLetterGrade(averageScore),
    mention: getMention(averageScore),
  };
}

export function getLetterGrade(average: number): string {
  if (average >= 16) return "A";
  if (average >= 14) return "B";
  if (average >= 12) return "C";
  if (average >= 10) return "D";
  return "F";
}

export function getMention(average: number): string {
  if (average >= 16) return "Tres bien";
  if (average >= 14) return "Bien";
  if (average >= 12) return "Assez bien";
  if (average >= 10) return "Passable";
  return "Insuffisant";
}