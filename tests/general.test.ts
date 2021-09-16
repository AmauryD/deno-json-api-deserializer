import {
  assertThrowsAsync,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { JsonApiDeserializer } from "../src/index.ts";
Deno.test("Deserialize malformed payload, expect to throw", () => {
  const deserializer = new JsonApiDeserializer();
  assertThrowsAsync(async () =>
    await deserializer.deserialize({
      data: [],
      // deno-lint-ignore no-explicit-any
    } as any)
  );
  // deno-lint-ignore no-explicit-any
  assertThrowsAsync(async () => await deserializer.deserialize({} as any));
});
