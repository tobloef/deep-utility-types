import {KeysAsDotNotation} from '../util-types/keys-as-dot-notation';
import {IsUnion} from '../util-types/is-union';
import {UnionToTuple} from '../util-types/union-to-tuple';
import {IsNever} from "../util-types/is-never";
import {ArrayType, IsArray} from "../util-types/is-array";
import {Assume} from "../util-types/assume";

export type DeepOptional<
  T,
  OptionalKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = (
  IsNever<OptionalKeys> extends true
    ? T
    : IsUnion<OptionalKeys> extends true
      ? UnionToTuple<OptionalKeys> extends Array<KeysAsDotNotation<T, IgnoredTypes>>
        ? DeepOptionalWithArrayOfKeys<T, UnionToTuple<OptionalKeys>, IgnoredTypes>
        : never
      : IsArray<T> extends true
        ? DeepOptionalInArray<Assume<T, ArrayType>, OptionalKeys, IgnoredTypes>
        : DeepOptionalInObject<T, OptionalKeys, IgnoredTypes>
  );

type DeepOptionalInArray<
  T extends (unknown[] | readonly unknown[]),
  OptionalKeys,
  IgnoredTypes
> = {
  [K in keyof T]: OptionalKeys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeepOptional<T[K], OptionalKeys, IgnoredTypes>
    : T[K]
}

export type DeepOptionalInObject<
  T,
  OptionalKeys,
  IgnoredTypes
> = (
  OptionalKeys extends `${infer TopKey}.${infer Rest}`
    ? TopKey extends keyof T
      ? (Omit<T, TopKey> & {
        [K in TopKey]?: DeepOptionalInsideProp<Exclude<T[K], undefined>, Rest, IgnoredTypes>
      })
      : T
    : OptionalKeys extends keyof T
      ? (Omit<T, OptionalKeys> & Partial<Pick<T, OptionalKeys>>)
      : T
  );

type DeepOptionalInsideProp<
  PropType,
  OptionalKeys,
  IgnoredTypes
> = (
  OptionalKeys extends KeysAsDotNotation<PropType, IgnoredTypes>
    ? DeepOptional<PropType, OptionalKeys, IgnoredTypes>
    : PropType
  )

type DistributeDeepOptional<
  T,
  OptionalKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes
> = (
  T extends any
    ? DeepOptional<T, OptionalKeys, IgnoredTypes>
    : never
  );

type DeepOptionalWithArrayOfKeys<
  T,
  OptionalKeys,
  IgnoredTypes,
> = (
  OptionalKeys extends []
    ? T
    : OptionalKeys extends [infer K, ...infer Rest]
      ? K extends KeysAsDotNotation<T, IgnoredTypes>
        ? Rest extends Array<KeysAsDotNotation<DeepOptional<T, K, IgnoredTypes>, IgnoredTypes>>
          ? DeepOptionalWithArrayOfKeys<DeepOptional<T, K, IgnoredTypes>, Rest, IgnoredTypes>
          : never
        : never
      : never
  );