import { JsonApiTopLevelDocument } from "../../src/json-api-types.ts";

export const basicPayload = {
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "To TDD or Not",
      "text":
        "TLDR; It's complicated... but check your test coverage regardless.",
    },
  },
} as JsonApiTopLevelDocument;

export const relationPayload = {
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "To TDD or Not",
      "text":
        "TLDR; It's complicated... but check your test coverage regardless.",
    },
  },
} as JsonApiTopLevelDocument;
