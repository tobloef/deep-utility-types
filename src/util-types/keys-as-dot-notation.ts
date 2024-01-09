/* eslint-disable @typescript-eslint/no-explicit-any */

import { IsUnion } from './is-union';

// eslint-disable-next-line @typescript-eslint/ban-types
export type DefaultIgnoredTypes = Function | number | string | Map<any, any> | Promise<any> | Date | RegExp;

export type KeysAsDotNotation<
  T,
  IgnoredTypes = never,
  Key extends keyof T = keyof T
> = (
  T extends (IgnoredTypes | DefaultIgnoredTypes)
    ? never
    : T extends (infer ElementType)[]
      ? DistributeDotNotation<ElementType, IgnoredTypes>
      : T extends readonly (infer ElementType)[]
        ? DistributeDotNotation<ElementType, IgnoredTypes>
        : IsUnion<T> extends true
          ? DistributeDotNotation<T, IgnoredTypes>
          : Key extends string
            ? (
              Key |
              `${Key}.${KeysAsDotNotation<Exclude<T[Key], undefined>, IgnoredTypes>}`
              )
            : never
  );

type DistributeDotNotation<T, IgnoredTypes> = T extends any
  ? KeysAsDotNotation<T, IgnoredTypes>
  : never;
