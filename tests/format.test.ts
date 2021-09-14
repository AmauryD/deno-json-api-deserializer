import { assertThrows } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { deserialize } from "../src/index.ts";

Deno.test("Deserialize malformed payload, expect to throw", () => {
    assertThrows(() => deserialize({
        data : []
    } as any));
    assertThrows(() => deserialize({} as any));
});

