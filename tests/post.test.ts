import { assertEquals, assertThrows } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { deserialize } from "../src/index.ts";
import postPayload from "./post-payload.ts";

// Simple name and function, compact form, but not configurable
Deno.test("Deserialize basic post", () => {
    const result = deserialize(postPayload);
    assertEquals(result.id,undefined);
    assertEquals(result.title,"a nice photo");
    assertEquals(result.photographer, "9");
});
