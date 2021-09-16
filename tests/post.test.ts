import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { JsonApiDeserializer } from "../src/index.ts";
import {
  basicPayload,
  idPayload,
  relationshipsPayload,
} from "./payloads/post-payload.ts";

Deno.test("Deserialize post", async () => {
  const deserializer = new JsonApiDeserializer();
  const result = await deserializer.deserialize(basicPayload);
  assertEquals(result.id, undefined);
  assertEquals(result.title, "a nice photo");
});

Deno.test("Deserialize post with relationships", async () => {
  const deserializer = new JsonApiDeserializer();
  const result = await deserializer.deserialize(relationshipsPayload);
  assertEquals(result.id, undefined);
  assertEquals(result.photographer, "9");
});

Deno.test("Deserialize post with id", async () => {
  const deserializer = new JsonApiDeserializer();
  const result = await deserializer.deserialize(idPayload);
  assertEquals(result.id, "550e8400-e29b-41d4-a716-446655440000");
  assertEquals(result.title, "Ember Hamster");
  assertEquals(result.src, "http://example.com/images/productivity.png");
});
