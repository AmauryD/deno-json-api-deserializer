import { JsonApiTopLevelDocument } from "../../src/json-api-types.ts";

export const basicPayload = {
  "data": {
    "type": "photos",
    "attributes": {
      "title": "a nice photo",
    },
  },
} as JsonApiTopLevelDocument;

export const relationshipsPayload = {
  "data": {
    "type": "photos",
    "relationships": {
      "photographer": {
        "data": { "type": "people", "id": "9" },
      },
    },
  },
} as JsonApiTopLevelDocument;

export const relationshipsArrayPayload = {
  "data": {
    "type": "photos",
    "relationships": {
      "photographers": {
        "data": [{ "type": "people", "id": "9" }, {
          "type": "people",
          "id": "10",
        }],
      },
    },
  },
} as JsonApiTopLevelDocument;

export const idPayload = {
  "data": {
    "type": "photos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "title": "Ember Hamster",
      "src": "http://example.com/images/productivity.png",
    },
  },
} as JsonApiTopLevelDocument;
