/**
 * Formats a grade value from underscore format to readable display format
 * @param grade - Grade value in underscore format (e.g., "5th_grade", "1st_year")
 * @returns Formatted grade string (e.g., "5th Grade", "1st Year")
 */
export function formatGrade(grade: string): string {
  return grade
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a challenge type from lowercase to title case
 * @param type - Challenge type (e.g., "regular", "bilingual")
 * @returns Formatted type string (e.g., "Regular", "Bilingual")
 */
export function formatChallengeType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Formats a stage value to readable display format
 * @param stage - Stage value (e.g., "Regional", "State", "National")
 * @returns Formatted stage string or "-" if null/undefined
 */
export function formatStage(stage: string | null | undefined): string {
  return stage ?? '-';
}
