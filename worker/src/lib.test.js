import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aggregateSplit,
  dayKeyInWindow,
  parseDayKey,
  parseFieldIndex,
  parseGuess,
  parseResendError,
  parseSpecimenId,
  parseTrayId,
  resendFrom,
  shortCallLabel,
  DEFAULT_RESEND_FROM
} from "./lib.js";

test("parseDayKey accepts calendar dates only", () => {
  assert.equal(parseDayKey("2026-08-21"), "2026-08-21");
  assert.equal(parseDayKey("2026-02-29"), "");
  assert.equal(parseDayKey("not-a-date"), "");
});

test("dayKeyInWindow rejects far-off stuffing dates", () => {
  const now = Date.UTC(2026, 7, 21);
  assert.equal(dayKeyInWindow("2026-08-21", now), true);
  assert.equal(dayKeyInWindow("2026-08-19", now), true);
  assert.equal(dayKeyInWindow("2026-01-01", now), false);
  assert.equal(dayKeyInWindow("2027-08-21", now), false);
});

test("parseTrayId and field index match the daily tray", () => {
  assert.equal(parseTrayId("organisms"), "organisms");
  assert.equal(parseTrayId("Human morphology"), "");
  assert.equal(parseFieldIndex(0), 0);
  assert.equal(parseFieldIndex(5), 5);
  assert.equal(parseFieldIndex("1"), 1);
  assert.equal(parseFieldIndex(6), null);
  assert.equal(parseFieldIndex(""), null);
});

test("parseGuess and specimen id stay bounded", () => {
  assert.equal(parseGuess("  Malaria (rings)  "), "Malaria (rings)");
  assert.equal(parseGuess("x".repeat(201)), "");
  assert.equal(parseSpecimenId("pf-rings"), "pf-rings");
  assert.equal(parseSpecimenId("bad id"), "");
});

test("aggregateSplit reports honest low-n counts", () => {
  const { n, split } = aggregateSplit([
    { guess: "Malaria (falciparum rings)" },
    { guess: "Malaria (falciparum rings)" },
    { guess: "Babesia" }
  ]);
  assert.equal(n, 3);
  assert.equal(split[0].label, "Malaria (falciparum rings)");
  assert.equal(split[0].count, 2);
  assert.equal(split[0].pct, 67);
  assert.equal(split[1].count, 1);
});

test("shortCallLabel prefers the diagnosis before the hint", () => {
  assert.equal(shortCallLabel("Malaria (falciparum rings)"), "Malaria");
  assert.equal(shortCallLabel("Babesia"), "Babesia");
});

test("parseResendError surfaces the provider message", () => {
  assert.equal(parseResendError('{"message":"domain is not verified"}', 403), "domain is not verified");
  assert.equal(parseResendError("upstream down", 502), "upstream down");
  assert.equal(parseResendError("", 500), "Resend HTTP 500");
});

test("resendFrom keeps the production default", () => {
  assert.equal(resendFrom(""), DEFAULT_RESEND_FROM);
  assert.equal(resendFrom("The Call <hello@example.com>"), "The Call <hello@example.com>");
});
