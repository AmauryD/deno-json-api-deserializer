import { JsonApiTopLevelDocument } from "../src/json-api-types.ts";

export default {
    "data": {
      "type": "photos",
      "attributes": {
        "title":"a nice photo"
      },
      "relationships": {
        "photographer": {
          "data": { "type": "people", "id": "9" }
        }
      }
    }
} as JsonApiTopLevelDocument<{
  title : string
}>;