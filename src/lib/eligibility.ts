import type { Question, Scheme } from "@/data/schemes";

export type EligibilityResult = {
  status: "eligible" | "not" | "more";
  satisfied: Question[];
  failed: Question[];
  missing: Question[];
};

/** Compare answers with scheme criteria. Any failed condition => "not"; else any unknown => "more". */
export function evaluate(scheme: Scheme, answers: Record<string, string>): EligibilityResult {
  const satisfied: Question[] = [];
  const failed: Question[] = [];
  const missing: Question[] = [];
  for (const q of scheme.questions) {
    const a = answers[q.id];
    if (!a || q.unknown?.includes(a) || (a === "unsure" && !q.pass.includes(a))) missing.push(q);
    else if (q.pass.includes(a)) satisfied.push(q);
    else failed.push(q);
  }
  const status = failed.length ? "not" : missing.length ? "more" : "eligible";
  return { status, satisfied, failed, missing };
}
