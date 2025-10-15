interface Entity {
  id: number;
}

interface NormalizedState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

export function normalize<T extends Entity>(data: T[]): NormalizedState<T> {
  const entities: { [id: number]: T } = {};
  const ids: number[] = [];

  for (const item of data) {
    entities[item.id] = item;
    ids.push(item.id);
  }

  return { entities, ids };
}