import { describe, it, expect } from "vitest";
import { computeGradeAverage, getLetterGrade, getMention } from "../lib/grades";

describe("computeGradeAverage - calcul de la moyenne ponderee", () => {
  it("calcule correctement avec les poids par defaut (20/30/50)", () => {
    const result = computeGradeAverage({
      assignmentScore: 15,
      midtermScore: 12,
      finalScore: 14,
      bonusScore: null,
      assignmentWeight: 20,
      midtermWeight: 30,
      finalWeight: 50,
    });
    // (15*20 + 12*30 + 14*50) / 100 = (300 + 360 + 700) / 100 = 13.6
    expect(result.averageScore).toBe(13.6);
    expect(result.letterGrade).toBe("C");
    expect(result.mention).toBe("Assez bien");
  });

  it("retourne null si une composante manque", () => {
    const result = computeGradeAverage({
      assignmentScore: 15,
      midtermScore: null,
      finalScore: 14,
      bonusScore: null,
      assignmentWeight: 20,
      midtermWeight: 30,
      finalWeight: 50,
    });
    expect(result.averageScore).toBeNull();
    expect(result.letterGrade).toBeNull();
  });

  it("ajoute le bonus apres ponderation", () => {
    const result = computeGradeAverage({
      assignmentScore: 10,
      midtermScore: 10,
      finalScore: 10,
      bonusScore: 2,
      assignmentWeight: 20,
      midtermWeight: 30,
      finalWeight: 50,
    });
    expect(result.averageScore).toBe(12);
  });

  it("plafonne la moyenne a 20 meme avec un gros bonus", () => {
    const result = computeGradeAverage({
      assignmentScore: 19,
      midtermScore: 19,
      finalScore: 19,
      bonusScore: 5,
      assignmentWeight: 20,
      midtermWeight: 30,
      finalWeight: 50,
    });
    expect(result.averageScore).toBe(20);
  });

  it("gere des ponderations personnalisees (pas 20/30/50)", () => {
    const result = computeGradeAverage({
      assignmentScore: 20,
      midtermScore: 0,
      finalScore: 0,
      bonusScore: null,
      assignmentWeight: 100,
      midtermWeight: 0,
      finalWeight: 0,
    });
    expect(result.averageScore).toBe(20);
  });
});

describe("getLetterGrade - lettre selon la moyenne", () => {
  it.each([
    [18, "A"],
    [16, "A"],
    [15.9, "B"],
    [14, "B"],
    [13.9, "C"],
    [12, "C"],
    [11.9, "D"],
    [10, "D"],
    [9.9, "F"],
    [0, "F"],
  ])("moyenne %f -> lettre %s", (avg, expected) => {
    expect(getLetterGrade(avg)).toBe(expected);
  });
});

describe("getMention - mention selon la moyenne", () => {
  it("Tres bien a partir de 16", () => {
    expect(getMention(16)).toBe("Tres bien");
  });
  it("Insuffisant en dessous de 10", () => {
    expect(getMention(9.99)).toBe("Insuffisant");
  });
});