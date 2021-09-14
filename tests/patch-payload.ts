import { JsonApiTopLevelDocument } from "../src/json-api-types.ts";

export default {
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "To TDD or Not",
      "text": "TLDR; It's complicated... but check your test coverage regardless."
    }
  }
} as JsonApiTopLevelDocument;