import {KeysAsDotNotation} from '../util-types/keys-as-dot-notation';
import {Assume} from "../util-types/assume";
import {IsNever} from "../util-types/is-never";
import {ArrayType, IsArray} from "../util-types/is-array";

export type DeepPick<
  T,
  PickedKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = (
  IsNever<PickedKeys> extends true
    ? IsArray<T> extends true
      ? []
      : {}
    : IsArray<T> extends true
      ? DeepPickInArray<Assume<T, ArrayType>, PickedKeys, IgnoredTypes>
      : DeepPickInObject<T, PickedKeys, IgnoredTypes>
);

type DeepPickInArray<
  T extends (unknown[] | readonly unknown[]),
  PickedKeys,
  IgnoredTypes
> = {
  [K in keyof T]: PickedKeys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeepPick<T[K], PickedKeys, IgnoredTypes>
    : T[K]
}

// type Picked = DeepPick<Test, "foo2.bar2.baz2" | "foo2.bar1">;

type DeepPickInObject<
  T,
  PickedKeys,
  IgnoredTypes
> = {
  [ObjectKey in keyof T as NeverIfKeyNotPicked<ObjectKey, PickedKeys>]: (
    DeepPickInsideProp<T[ObjectKey], PickedKeys, IgnoredTypes>
    )
}

type NeverIfKeyNotPicked<Key, PickedKeys> = (
  PickedKeys extends `${infer TopKey}.${string}`
    ? Key extends TopKey
      ? Key
      : never
    : Key extends PickedKeys
      ? Key
      : never
  );

type DeepPickInsideProp<
  PropType,
  PickedKeys,
  IgnoredTypes
> = (
  PickedKeys extends `${string}.${infer Rest}`
    ? Rest extends KeysAsDotNotation<PropType, IgnoredTypes>
      ? DeepPick<PropType, Rest, IgnoredTypes>
      : PropType
    : PropType
  )

type DistributeDeepPick<
  T,
  PickedKeys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes
> = (
  T extends any
    ? DeepPick<T, PickedKeys, IgnoredTypes>
    : never
  );

type DeepPickWithArrayOfKeys<
  T,
  PickedKeys,
  IgnoredTypes,
> = (
  PickedKeys extends []
    ? T
    : PickedKeys extends [infer K, ...infer Rest]
      ? K extends KeysAsDotNotation<T, IgnoredTypes>
        ? Rest extends Array<KeysAsDotNotation<DeepPick<T, K, IgnoredTypes>, IgnoredTypes>>
          ? DeepPickWithArrayOfKeys<DeepPick<T, K, IgnoredTypes>, Rest, IgnoredTypes>
          : never
        : never
      : never
  );