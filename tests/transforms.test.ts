import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { JsonApiDeserializer } from "../src/index.ts";
import {
  basicPayload,
  relationshipsArrayPayload,
  relationshipsPayload,
} from "./payloads/post-payload.ts";
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
        ]), 100)
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
        ]), 100)
    );
  };

  const result = await deserializer.deserialize(relationshipsArrayPayload);
  assertEquals(result.photographers, undefined);
  assertEquals((result.PHOTOGRAPHERS as string[])[0], "people_9");
  assertEquals((result.PHOTOGRAPHERS as string[])[1], "people_10");
});

Deno.test("Does not handle key when returns undefined", async () => {
  const deserializer = new JsonApiDeserializer();
  deserializer.transformAttributeFunction = (key, value) => {
    if (key === "title") {
      return undefined;
    }
    return [key, value];
  };

  const result = await deserializer.deserialize(basicPayload);
  assertEquals(result.title, undefined);
  assertNotEquals(result.src, undefined);
});
