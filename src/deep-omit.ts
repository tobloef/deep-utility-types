import { DefaultIgnoredTypes, KeysAsDotNotation } from './keys-as-dot-notation';
import { IsUnion } from './is-union';
import { UnionToTuple } from './union-to-tuple';

export type DeepOmit<
  T,
  OmittedKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = DefaultIgnoredTypes
> = (
  // For some reason we have to do the check twice
  (OmittedKeys extends never ? never : OmittedKeys) extends never
    ? T
    : IsUnion<OmittedKeys> extends true
      ? UnionToTuple<OmittedKeys> extends Array<KeysAsDotNotation<T, IgnoredTypes>>
        ? DeepOmitWithArrayOfKeys<T, UnionToTuple<OmittedKeys>, IgnoredTypes>
        : never
      : T extends (unknown[] | readonly unknown[])
        ? DeepOmitInArray<T, OmittedKeys, IgnoredTypes>
        : DeepOmitInObject<T, OmittedKeys, IgnoredTypes>
  );

type DeepOmitInArray<
  T extends (unknown[] | readonly unknown[]),
  OmittedKeys,
  IgnoredTypes = DefaultIgnoredTypes
> = {
  [K in keyof T]: OmittedKeys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeepOmit<T[K], OmittedKeys, IgnoredTypes>
    : T[K]
}

type DeepOmitInObject<
  T,
  OmittedKeys,
  IgnoredTypes = DefaultIgnoredTypes
> = {
  [ObjectKey in keyof T as NeverIfKeyOmitted<ObjectKey, OmittedKeys>]: (
    ObjectKey extends OmittedKeys
      ? never
      : DeepOmitInsideProp<ObjectKey, T[ObjectKey], OmittedKeys, IgnoredTypes>
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
  ObjectKey,
  PropType,
  OmittedKeys,
  IgnoredTypes = DefaultIgnoredTypes
> = (
  OmittedKeys extends `${infer Key}.${infer Rest}`
    ? ObjectKey extends Key
      ? Rest extends KeysAsDotNotation<PropType, IgnoredTypes>
        ? DeepOmit<PropType, Rest, IgnoredTypes>
        : PropType
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
  IgnoredTypes = DefaultIgnoredTypes,
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