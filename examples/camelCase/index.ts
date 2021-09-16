import { camelCase } from "../../dev_deps.ts";
import { JsonApiDeserializer } from "../../mod.ts";

async function main() {
  const deserializer = new JsonApiDeserializer();

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
  console.log(deserialized);
}

main();
