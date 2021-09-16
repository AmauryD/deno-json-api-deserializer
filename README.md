# deno-json-api-deserializer [![Deno](https://github.com/AmauryD/deno-json-api-deserializer/actions/workflows/deno.yml/badge.svg)](https://github.com/AmauryD/deno-json-api-deserializer/actions/workflows/deno.yml)

A backend deserializer for JSON:API payloads.

## Features

- Deserialize JSON:API payloads
- Async
- Highly modular with transforms functions
- Filtering attributes/relationships

## Examples

Simple use

```typescript
import { JsonApiDeserializer } from "...";

const deserializer = new JsonApiDeserializer();
await desserializer.deserialize({
  data: {
    attributes: {
      title: "test",
    },
  },
});
```

camelCase deserializer with transforms

```typescript
const deserializer = new JsonApiDeserializer();

async function main() {
  /**
   * For every transformation, we apply the camelCase function on the key
   */
  deserializer.transformAttributeFunction = (
    key,
    value,
  ) => [camelCase(key), value];
  deserializer.transformManyRelationshipFunction = (
    key,
    value,
  ) => [camelCase(key), value.map((e) => e.id)];
  deserializer.transformOneRelationshipFunction = (
    key,
    value,
  ) => [camelCase(key), value];

  const deserialized = await deserializer.deserialize({
    data: {
      attributes: {
        title_test: "test",
      },
      relationships: {
        people_comments: {
          data: [
            { type: "comments", id: "9" },
            { type: "comments", id: "10" },
          ],
        },
      },
    },
  });
  // { id: undefined, peopleComments: [ "9", "10" ], titleTest: "test" }
}
```

Filtering

```typescript
import { JsonApiDeserializer } from "...";

// allowed elements
const whitelist = ["title", "content"];

async function main() {
  const deserializer = new JsonApiDeserializer();

  /**
   * when a transform returns undefined instead of a tuple, the property is skipped
   */
  deserializer.transformAttributeFunction = (
    key,
    value,
  ) => whitelist.includes(key) ? [key, value] : undefined;

  const deserialized = await deserializer.deserialize({
    data: {
      attributes: {
        title: "test",
        content: "test",
        unknownAttribute: "blah",
      },
    },
  });

  // { id: undefined, title: "test", content: "test" }
}
```
