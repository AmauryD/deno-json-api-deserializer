export interface JsonApiTopLevelDocument<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  data: JsonApiResourceObject<T> | JsonApiResourceObject<T>[]; // an array is not possible in theory for deserialization, but maybe in a future version ?
  meta?: Record<string, unknown>;
  errors?: Record<string, unknown>[]; // no need to have more infos about errors
}

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

export interface JsonApiLink {
  href: string;
  meta: Record<string, unknown>;
}

export interface JsonApiLinks {
  [key: string]: string | JsonApiLink;
}

export type JsonApiResourceLinkage =
  | null
  | []
  | JsonApiResourceIdentifier
  | JsonApiResourceIdentifier[];

export interface JsonApiRelationshipsObject {
  links?: {
    self?: string;
    related?: string;
  };
  data?: JsonApiResourceLinkage;
  meta?: Record<string, unknown>;
}

export interface JsonApiResourceObject<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  id?: string; // optional for create
  type?: string;
  attributes?: T;
  relationships?: Record<string, JsonApiRelationshipsObject>;
  links?: JsonApiLinks;
  meta?: Record<string, unknown>;
}

export interface JsonApiResourceObjectCreate<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends JsonApiResourceObject<T> {
  id?: string; // optional for create
  type?: string;
}

export interface JsonApiResourceObjectUpdate<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends JsonApiResourceObject<T> {
  id: string; // optional for create
  type: string;
}
