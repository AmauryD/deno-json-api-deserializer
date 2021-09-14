import { JsonApiRelationshipsObject, JsonApiResourceLinkage, JsonApiResourceObject, JsonApiTopLevelDocument } from "./json-api-types.ts";

export function deserialize<T extends Record<string,unknown>>(payload: JsonApiTopLevelDocument<T>) {
    if (!payload.data) {
        throw new Error("This does not seems to be a valid json-api payload.");
    }

    if (Array.isArray(payload.data))
        throw new Error("The request MUST include a single resource object as primary data.");
    
    return deserializeResourceObject(payload.data);
}

export function deserializeResourceObject(resourceObject: JsonApiResourceObject) {
    const deserializedObject : Record<string,unknown> = { 
        id : resourceObject.id, 
        ...resourceObject.attributes, 
        ...resourceObject.relationships ? handleRelationships(resourceObject.relationships) : {} 
    };
    return deserializedObject;
}

function handleRelationshipData(resourceLinkage: JsonApiResourceLinkage): any {
    if (Array.isArray(resourceLinkage)) {
        return resourceLinkage.map((e) => handleRelationshipData(e));
    }
    return resourceLinkage?.id;
}

export function handleRelationships(relationshipsObject: Record<string,JsonApiRelationshipsObject>) {
    const relationships: Record<string,unknown> = {};

    for (const relationshipName in relationshipsObject) {
        const relationShipValue = relationshipsObject[relationshipName];
        if (relationShipValue.data) {
            relationships[relationshipName] = handleRelationshipData(relationShipValue.data);
        }
    }

    return relationships;
}