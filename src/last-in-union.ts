import { UnionToIntersection } from './union-to-intersection';

export type LastInUnion<Union> = UnionToIntersection<
  Union extends unknown ? (x: Union) => 0 : never
> extends (x: infer Last) => 0
  ? Last
  : never;
