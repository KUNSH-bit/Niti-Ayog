import { describe, expect, it } from "vitest";
import { evaluate } from "@/lib/eligibility";
import { getScheme } from "@/data/schemes";

const orunodoi = getScheme("orunodoi")!;

describe("eligibility", () => {
  it("Assam low-income family with woman and no govt employee is potentially eligible", () => {
    expect(evaluate(orunodoi, { state: "Assam", income: "lt1", woman: "yes", govt: "no" }).status).toBe("eligible");
  });
  it("non-Assam resident fails Orunodoi", () => {
    expect(evaluate(orunodoi, { state: "IN", income: "lt1", woman: "yes", govt: "no" }).status).toBe("not");
  });
  it("'prefer not to say' income needs more information", () => {
    expect(evaluate(orunodoi, { state: "Assam", income: "unsure", woman: "yes", govt: "no" }).status).toBe("more");
  });
});
