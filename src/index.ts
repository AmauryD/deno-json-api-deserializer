import {
  JsonApiRelationshipsObject,
  JsonApiResourceIdentifier,
  JsonApiResourceLinkage,
  JsonApiResourceObject,
  JsonApiTopLevelDocument,
} from "./json-api-types.ts";

type AttributeTransformFunction = (
  key: string,
  value: unknown,
) => Promise<[string, unknown] | undefined> | [string, unknown] | undefined;

type RelationshipOneTransformFunction = (
  key: string,
  value: JsonApiResourceIdentifier | null,
) => Promise<[string, unknown] | undefined> | [string, unknown] | undefined;

type RelationshipManyTransformFunction = (
  key: string,
  value: JsonApiResourceIdentifier[],
) => Promise<[string, unknown] | undefined> | [string, unknown] | undefined;

export const defaultTransformAttributeFunction: AttributeTransformFunction = (
  key: string,
  value: unknown,
) => [key, value];

export const defaultTransformManyRelationshipFunction:
  RelationshipManyTransformFunction = (
    key: string,
    value: JsonApiResourceIdentifier[],
  ) => [key, value.map((e) => e.id)];

export const defaultTransformOneRelationshipFunction:
  RelationshipOneTransformFunction = (
    key: string,
    value: JsonApiResourceIdentifier | null,
  ) => [key, value?.id];

export class JsonApiDeserializer<T extends Record<string, unknown>> {
  private _transformAttributeFunction: AttributeTransformFunction =
    defaultTransformAttributeFunction;
  private _transformOneRelationshipFunction: RelationshipOneTransformFunction =
    defaultTransformOneRelationshipFunction;
  private _transformManyRelationshipFunction:
    RelationshipManyTransformFunction =
      defaultTransformManyRelationshipFunction;

  set transformAttributeFunction(value: AttributeTransformFunction) {
    this._transformAttributeFunction = value;
  }

  set transformManyRelationshipFunction(
    value: RelationshipManyTransformFunction,
  ) {
    this._transformManyRelationshipFunction = value;
  }

  set transformOneRelationshipFunction(
    value: RelationshipOneTransformFunction,
  ) {
    this._transformOneRelationshipFunction = value;
  }

  public deserialize(payload: JsonApiTopLevelDocument<T>) {
    if (!payload.data) {
      throw new Error("This does not seems to be a valid json-api payload.");
    }

    if (Array.isArray(payload.data)) {
      throw new Error(
        "The request MUST include a single resource object as primary data.",
      );
    }

    return this.deserializeResourceObject(payload.data);
  }

  protected async deserializeResourceObject(
    resourceObject: JsonApiResourceObject,
  ) {
    const deserializedObject: Record<string, unknown> = {
      id: resourceObject.id,
      ...resourceObject.relationships
        ? await this.handleRelationships(resourceObject.relationships)
        : {},
    };

    const attributesPromises = [];

    if (resourceObject.attributes) {
      for (const attributeKey in resourceObject.attributes) {
        attributesPromises.push((async () => {
          const attributeResult = await this
            ._transformAttributeFunction(
              attributeKey,
              resourceObject.attributes![attributeKey],
            );
          if (attributeResult === undefined) {
            return;
          }
          deserializedObject[attributeResult[0]] = attributeResult[1];
        })());
      }
    }

    await Promise.all(attributesPromises);

    return deserializedObject;
  }

  protected handleRelationshipData(
    relationshipName: string,
    resourceLinkage: JsonApiResourceLinkage,
  ) {
    if (Array.isArray(resourceLinkage)) {
      return this._transformManyRelationshipFunction(
        relationshipName,
        resourceLinkage,
      );
    }
    return this._transformOneRelationshipFunction(
      relationshipName,
      resourceLinkage,
    );
  }

  protected async handleRelationships(
    relationshipsObject: Record<string, JsonApiRelationshipsObject>,
  ) {
    const relationships: Record<string, unknown> = {};
    const relationshipsPromises = [];

    for (const relationshipName in relationshipsObject) {
      relationshipsPromises.push((async () => {
        const relationShipValue = relationshipsObject[relationshipName];
        if (relationShipValue.data) {
          const relationshipData = await this.handleRelationshipData(
            relationshipName,
            relationShipValue.data,
          );
          if (relationshipData === undefined) {
            return;
          }
          relationships[relationshipData[0]] = relationshipData[1];
        }
      })());
    }

    await Promise.all(relationshipsPromises);

    return relationships;
  }
}
