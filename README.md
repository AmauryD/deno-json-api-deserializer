# deno-json-api-deserializer [![Deno](https://github.com/AmauryD/deno-json-api-deserializer/actions/workflows/deno.yml/badge.svg)](https://github.com/AmauryD/deno-json-api-deserializer/actions/workflows/deno.yml)

A deserializer for JSON:API payloads

## Features

- Deserialize JSON:API payloads
- Async
- Highly modular with transforms functions

## Examples

Simple use

```typescript
import { JsonApiDeserializer } from "...";
async main() {
    const deserializer = new JsonApiDeserializer();
    await desserializer.deserialize({
        data : {
            attributes : {
                title : "test"
            }
        }
    });
}
```

camelCase deserializer with transforms

```typescript
import { JsonApiDeserializer } from "...";
import camelCase from "https://deno.land/x/case/camelCase.ts";
async main() {
    const deserializer = new JsonApiDeserializer();
    deserializer.transformAttributeFunction = (key,value) => {
        return [camelCase(key),value];
    }
    await deserializer.deserialize({
        data : {
            attributes : {
                title : "test"
            }
        }
    });
}
```
