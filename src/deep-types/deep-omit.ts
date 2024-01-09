import {KeysAsDotNotation} from '../util-types/keys-as-dot-notation';
import {IsUnion} from '../util-types/is-union';
import {UnionToTuple} from '../util-types/union-to-tuple';
import {IsNever} from "../util-types/is-never";
import {ArrayType, IsArray} from "../util-types/is-array";
import {Assume} from "../util-types/assume";

export type DeepOmit<
  T,
  OmittedKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = (
  IsNever<OmittedKeys> extends true
    ? T
    : IsUnion<OmittedKeys> extends true
      ? UnionToTuple<OmittedKeys> extends Array<KeysAsDotNotation<T, IgnoredTypes>>
        ? DeepOmitWithArrayOfKeys<T, UnionToTuple<OmittedKeys>, IgnoredTypes>
        : never
      : IsArray<T> extends true
        ? DeepOmitInArray<Assume<T, ArrayType>, OmittedKeys, IgnoredTypes>
        : DeepOmitInObject<T, OmittedKeys, IgnoredTypes>
  );

type DeepOmitInArray<
  T extends (unknown[] | readonly unknown[]),
  OmittedKeys,
  IgnoredTypes
> = {
  [K in keyof T]: OmittedKeys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeepOmit<T[K], OmittedKeys, IgnoredTypes>
    : T[K]
}

type DeepOmitInObject<
  T,
  OmittedKeys,
  IgnoredTypes
> = {
  [ObjectKey in keyof T as NeverIfKeyOmitted<ObjectKey, OmittedKeys>]: (
    DeepOmitInsideProp<T[ObjectKey], OmittedKeys, IgnoredTypes>
    )
}

type NeverIfKeyOmitted<Key, OmittedKeys> = (
  OmittedKeys extends `${string}.${string}`
    ? Key
    : Key extends OmittedKeys
      ? never
      : Key
  );

type DeepOmitInsideProp<
  PropType,
  OmittedKeys,
  IgnoredTypes
> = (
  OmittedKeys extends `${string}.${infer Rest}`
    ? Rest extends KeysAsDotNotation<PropType, IgnoredTypes>
      ? DeepOmit<PropType, Rest, IgnoredTypes>
      : PropType
    : PropType
  )

type DistributeDeepOmit<
  T,
  OmittedKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes
> = (
  T extends any
    ? DeepOmit<T, OmittedKeys, IgnoredTypes>
    : never
  );

type DeepOmitWithArrayOfKeys<
  T,
  OmittedKeys,
  IgnoredTypes,
> = (
  OmittedKeys extends []
    ? T
    : OmittedKeys extends [infer K, ...infer Rest]
      ? K extends KeysAsDotNotation<T, IgnoredTypes>
        ? Rest extends Array<KeysAsDotNotation<DeepOmit<T, K, IgnoredTypes>, IgnoredTypes>>
          ? DeepOmitWithArrayOfKeys<DeepOmit<T, K, IgnoredTypes>, Rest, IgnoredTypes>
          : never
        : never
      : never
  );