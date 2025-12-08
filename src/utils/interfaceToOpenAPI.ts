// Helper function to convert TypeScript interface to OpenAPI schema
const getType = (value: any): any => {
  if (value === null) return { type: 'string', nullable: true };
  if (value instanceof Date) return { type: 'string', format: 'date-time' };
  if (Array.isArray(value))
    return { type: 'array', items: getType(value[0]) };
  if (typeof value === 'object') {
    return {
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, getType(val)])
      ),
    };
  }
  return { type: typeof value };
};

export const interfaceToOpenAPI = <T>(example?: T) => {
  return {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(example || {}).map(([key, value]) => [
        key,
        getType(value),
      ])
    ),
  };
};