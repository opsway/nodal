// import { v4 as uuid } from 'uuid';

const sequence: Map<string, number> = new Map();

const sequenceClear = (): void => sequence.clear();

const uuid = (namespace: string = ''): string => {
  const counter = (sequence.get(namespace) || 0) + 1;
  sequence.set(namespace, counter);

  return `${namespace}_${counter}`;
};

const random = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const dateToString = (date: Date): string => {
  return (date.getFullYear().toString() + '-'
    + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
    + ('0' + (date.getDate())).slice(-2))
    + 'T' + date.toTimeString().slice(0, 8);
};

export {
  uuid,
  sequenceClear,
  random,
  dateToString,
};
