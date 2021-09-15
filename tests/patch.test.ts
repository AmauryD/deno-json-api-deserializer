import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { deserialize } from "../src/index.ts";
import patchPayload from "./payloads/patch-payload.ts";

Deno.test("Deserialize basic patch", () => {
  const result = deserialize(patchPayload);

  assertEquals(result.id, "1");
  assertEquals(result.title, "To TDD or Not");
  assertEquals(
    result.text,
    "TLDR; It's complicated... but check your test coverage regardless.",
  );
});
