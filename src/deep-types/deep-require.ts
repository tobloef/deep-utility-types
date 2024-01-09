import {DefaultIgnoredTypes, KeysAsDotNotation} from '../util-types/keys-as-dot-notation';
import {IsUnion} from '../util-types/is-union';
import {UnionToTuple} from '../util-types/union-to-tuple';
import {IsNever} from "../util-types/is-never";
import {ArrayType, IsArray} from "../util-types/is-array";
import {Assume} from "../util-types/assume";

export type DeepRequire<
  T,
  RequiredKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = (
  IsNever<RequiredKeys> extends true
    ? T
    : IsUnion<RequiredKeys> extends true
      ? UnionToTuple<RequiredKeys> extends Array<KeysAsDotNotation<T, IgnoredTypes>>
        ? DeepRequireWithArrayOfKeys<T, UnionToTuple<RequiredKeys>, IgnoredTypes>
        : never
      : IsArray<T> extends true
        ? DeepRequireInArray<Assume<T, ArrayType>, RequiredKeys, IgnoredTypes>
        : DeepRequireInObject<T, RequiredKeys, IgnoredTypes>
  );

type DeepRequireInArray<
  T extends (unknown[] | readonly unknown[]),
  RequiredKeys,
  IgnoredTypes
> = {
  [K in keyof T]: RequiredKeys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeepRequire<T[K], RequiredKeys, IgnoredTypes>
    : T[K]
}

export type DeepRequireInObject<
  T,
  RequiredKeys,
  IgnoredTypes
> = (
  RequiredKeys extends `${infer TopKey}.${infer Rest}`
    ? TopKey extends keyof T
      ? (Omit<T, TopKey> & {
        [K in TopKey]-?: DeepRequireInsideProp<Exclude<T[K], undefined>, Rest, IgnoredTypes>
      })
      : T
    : RequiredKeys extends keyof T
      ? (Omit<T, RequiredKeys> & Required<Pick<T, RequiredKeys>>)
      : T
  );

type DeepRequireInsideProp<
  PropType,
  RequiredKeys,
  IgnoredTypes
> = (
  RequiredKeys extends KeysAsDotNotation<PropType, IgnoredTypes>
    ? DeepRequire<PropType, RequiredKeys, IgnoredTypes>
    : PropType
  )

type DistributeDeepRequire<
  T,
  RequiredKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes
> = (
  T extends any
    ? DeepRequire<T, RequiredKeys, IgnoredTypes>
    : never
  );

type DeepRequireWithArrayOfKeys<
  T,
  RequiredKeys,
  IgnoredTypes,
> = (
  RequiredKeys extends []
    ? T
    : RequiredKeys extends [infer K, ...infer Rest]
      ? K extends KeysAsDotNotation<T, IgnoredTypes>
        ? Rest extends Array<KeysAsDotNotation<DeepRequire<T, K, IgnoredTypes>, IgnoredTypes>>
          ? DeepRequireWithArrayOfKeys<DeepRequire<T, K, IgnoredTypes>, Rest, IgnoredTypes>
          : never
        : never
      : never
  );