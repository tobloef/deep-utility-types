import { KeysAsDotNotation } from './keys-as-dot-notation';
import { IsUnion } from './is-union';
import { UnionToTuple } from './union-to-tuple';
import {ApplyHigherKindedType, HigherKindedOmit, HigherKindedPick, HigherKindedType} from "./higher-kinded-types";
import {Assume} from "./assume";

export type Deep<
  Operation extends HigherKindedType,
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = (
  // For some reason we have to do the check twice
  (Keys extends never ? never : Keys) extends never
    ? T
    : IsUnion<Keys> extends true
      ? UnionToTuple<Keys> extends Array<KeysAsDotNotation<T, IgnoredTypes>>
        ? DeepWithArrayOfKeys<Operation, T, UnionToTuple<Keys>, IgnoredTypes>
        : never
      : T extends (unknown[] | readonly unknown[])
        ? DeepInArray<Operation, T, Keys, IgnoredTypes>
        : T extends object
          ? Keys extends `${string}.${string}`
            ? DeepInObject<Operation, T, Keys, IgnoredTypes>
            : ApplyHigherKindedType<Operation, T, Assume<Keys, keyof T>>
          : T
  );

type DeepInArray<
  Operation extends HigherKindedType,
  T extends (unknown[] | readonly unknown[]),
  Keys,
  IgnoredTypes
> = {
  [K in keyof T]: Keys extends KeysAsDotNotation<T[K], IgnoredTypes>
    ? DistributeDeep<Operation, T[K], Keys, IgnoredTypes>
    : T[K]
}

type DeepInObject<
  Operation extends HigherKindedType,
  T,
  Keys,
  IgnoredTypes
> = {
  [ObjectKey in keyof T]: (
    DeepInsideProp<Operation, ObjectKey, T[ObjectKey], Keys, IgnoredTypes>
  )
}

type DeepInsideProp<
  Operation extends HigherKindedType,
  ObjectKey,
  PropType,
  Keys,
  IgnoredTypes
> = (
  Keys extends `${infer Key}.${infer Rest}`
    ? ObjectKey extends Key
      ? Rest extends KeysAsDotNotation<PropType, IgnoredTypes>
        ? Deep<Operation, PropType, Rest, IgnoredTypes>
        : PropType
      : PropType
    : PropType
  )

type DistributeDeep<
  Operation extends HigherKindedType,
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes
> = (
  T extends any
    ? Deep<Operation, T, Keys, IgnoredTypes>
    : never
  );

type DeepWithArrayOfKeys<
  Operation extends HigherKindedType,
  T,
  Keys,
  IgnoredTypes,
> = (
  Keys extends []
    ? T
    : Keys extends [infer K, ...infer Rest]
      ? K extends KeysAsDotNotation<T, IgnoredTypes>
        ? Rest extends Array<KeysAsDotNotation<Deep<Operation, T, K, IgnoredTypes>, IgnoredTypes>>
          ? DeepWithArrayOfKeys<Operation, Deep<Operation, T, K, IgnoredTypes>, Rest, IgnoredTypes>
          : never
        : never
      : never
  );