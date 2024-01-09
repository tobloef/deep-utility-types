import { LastInUnion } from './last-in-union';

export type UnionToTuple<Union, Last = LastInUnion<Union>> = [Union] extends [never]
  ? []
  : [...UnionToTuple<Exclude<Union, Last>>, Last];
