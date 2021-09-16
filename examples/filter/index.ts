import { JsonApiDeserializer } from "../../mod.ts";

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
  console.log(deserialized);
}

main();
