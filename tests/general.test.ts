import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { JsonApiDeserializer } from "../src/index.ts";
import {
  basicPayload,
  relationshipsArrayPayload,
  relationshipsPayload,
} from "./payloads/post-payload.ts";

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

Deno.test("Custom attributes function", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformAttributeFunction = (key, value) => {
    return [key.toUpperCase(), "_" + value];
  };
  const result = await deserializer.deserialize(basicPayload);
  assertEquals(result.title, undefined);
  assertEquals(result.TITLE, "_a nice photo");
});

Deno.test("Custom one relationships function", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformOneRelationshipFunction = (key, value) => {
    return [
      key.toUpperCase(),
      `${value?.type}_${value?.id}`,
    ];
  };
  deserializer.transformManyRelationshipFunction = () => {
    throw new Error("Does not meant to be called");
  };

  const result = await deserializer.deserialize(relationshipsPayload);
  assertEquals(result.photographer, undefined);
  assertEquals(result.PHOTOGRAPHER as string, "people_9");
});

Deno.test("Custom many relationships function", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformOneRelationshipFunction = () => {
    throw new Error("Does not meant to be called");
  };
  deserializer.transformManyRelationshipFunction = (key, value) => {
    return [
      key.toUpperCase(),
      value.map((e) => `${e.type}_${e.id}`),
    ];
  };

  const result = await deserializer.deserialize(relationshipsArrayPayload);
  assertEquals(result.photographers, undefined);
  assertEquals((result.PHOTOGRAPHERS as string[])[0], "people_9");
  assertEquals((result.PHOTOGRAPHERS as string[])[1], "people_10");
});

Deno.test("Custom async one relationships function", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformOneRelationshipFunction = (key, value) => {
    return new Promise((res) =>
      setTimeout(() =>
        res([
          key.toUpperCase(),
          `${value?.type}_${value?.id}`,
        ]), 500)
    );
  };
  deserializer.transformManyRelationshipFunction = () => {
    throw new Error("Does not meant to be called");
  };

  const result = await deserializer.deserialize(relationshipsPayload);
  assertEquals(result.photographer, undefined);
  assertEquals(result.PHOTOGRAPHER as string, "people_9");
});

Deno.test("Custom async many relationships function", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformOneRelationshipFunction = () => {
    throw new Error("Does not meant to be called");
  };
  deserializer.transformManyRelationshipFunction = (key, value) => {
    return new Promise((res) =>
      setTimeout(() =>
        res([
          key.toUpperCase(),
          value.map((e) => `${e.type}_${e.id}`),
        ]), 500)
    );
  };

  const result = await deserializer.deserialize(relationshipsArrayPayload);
  assertEquals(result.photographers, undefined);
  assertEquals((result.PHOTOGRAPHERS as string[])[0], "people_9");
  assertEquals((result.PHOTOGRAPHERS as string[])[1], "people_10");
});
