import { type SchemaTypeDefinition } from 'sanity'
// Import all schemas from the schemas directory
import { schemaTypes } from '../schemas'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
