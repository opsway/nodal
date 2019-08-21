// import { v4 as uuid } from 'uuid';

const sequence: Map<string, number> = new Map();

const sequenceClear = (): void => sequence.clear();

const uuid = (namespace: string = ''): string => {
  const counter = (sequence.get(namespace) || 0) + 1;
  sequence.set(namespace, counter);

  return `${namespace}_${counter}`;
};

export {
  uuid,
  sequenceClear,
};
