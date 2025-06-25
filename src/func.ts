export function highlight_json(json: any, isKey = false): string {
  if (isKey) {
    return `§b${json}§r`;
  }

  switch (typeof json) {
    case 'string':
      return `§a"${json}"§r`;
    case 'number':
      return `§6${json}§r`;
    case 'boolean':
      return `§6${json}§r`;
    case 'object':
      if (json === null) {
        return 'null';
      }
      if (Array.isArray(json)) {
        const elements = json.map(item => highlight_json(item));
        return `[${elements.join(', ')}]`;
      } else {
        const entries = Object.entries(json).map(([key, value]: [string, any]) => {
          const coloredKey = highlight_json(key, true);
          const coloredValue = highlight_json(value);
          return `${coloredKey}: ${coloredValue}`;
        });
        return `{${entries.join(', ')}}`;
      }
    default:
      return json;
  }
}