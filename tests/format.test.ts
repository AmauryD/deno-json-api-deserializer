import { assertThrows } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { deserialize } from "../src/index.ts";

Deno.test("Deserialize malformed payload, expect to throw", () => {
  assertThrows(() =>
    deserialize({
      data: [],
      // deno-lint-ignore no-explicit-any
    } as any)
  );
  // deno-lint-ignore no-explicit-any
  assertThrows(() => deserialize({} as any));
});
