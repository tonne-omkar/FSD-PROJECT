/**
 * Compares a student's resume skills against a company's required skills
 * and provides match scores, matched list, and missing skill gaps.
 */
export function analyzeSkillsMatch(studentSkills = [], requiredSkills = []) {
  const normalizedStudent = (studentSkills || []).map((s) => s.toLowerCase().trim());

  const matched = [];
  const missing = [];

  (requiredSkills || []).forEach((req) => {
    const reqLower = req.toLowerCase().trim();
    const isMatched = normalizedStudent.some(
      (stud) => stud === reqLower || stud.includes(reqLower) || reqLower.includes(stud)
    );

    if (isMatched) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const total = requiredSkills.length || 1;
  const matchPercentage = Math.round((matched.length / total) * 100);

  let fitLevel = 'Strong Fit';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (matchPercentage >= 75) {
    fitLevel = 'Strong Skill Fit';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (matchPercentage >= 40) {
    fitLevel = 'Good Match (Minor Gaps)';
    badgeColor = 'bg-brand-50 text-brand-700 border-brand-200';
  } else {
    fitLevel = 'Skill Gap Opportunity';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return {
    matched,
    missing,
    matchPercentage,
    fitLevel,
    badgeColor,
    hasGaps: missing.length > 0,
    totalRequired: requiredSkills.length,
  };
}
