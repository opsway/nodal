// import { v4 as uuid } from 'uuid';

const sequence: Map<string, number> = new Map();

const uuid = (namespace: string = ''): string => {
  const counter = (sequence.get(namespace) || 0) + 1;
  sequence.set(namespace, counter);

  return `${namespace}${counter}`;
};

export {
  uuid,
};
