import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { JsonApiDeserializer } from "../src/index.ts";
import { basicPayload } from "./payloads/patch-payload.ts";

Deno.test("Deserialize basic patch", async () => {
  const deserializer = new JsonApiDeserializer();
  const result = await deserializer.deserialize(basicPayload);

  assertEquals(result.id, "1");
  assertEquals(result.title, "To TDD or Not");
  assertEquals(
    result.text,
    "TLDR; It's complicated... but check your test coverage regardless.",
  );
});
