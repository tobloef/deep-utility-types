import {Deep} from "./deep";
import {KeysAsDotNotation} from "./keys-as-dot-notation";
import {HigherKindedOmit, HigherKindedOptional, HigherKindedPick, HigherKindedRequire} from "./higher-kinded-types";

export type DeepOmit<
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = Deep<
  HigherKindedOmit,
  T,
  Keys,
  IgnoredTypes
>;

export type DeepPick<
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = Deep<
  HigherKindedPick,
  T,
  Keys,
  IgnoredTypes
>;

export type DeepRequire<
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = Deep<
  HigherKindedRequire,
  T,
  Keys,
  IgnoredTypes
>;

export type DeepOptional<
  T,
  Keys extends KeysAsDotNotation<T, IgnoredTypes>,
  IgnoredTypes = never
> = Deep<
  HigherKindedOptional,
  T,
  Keys,
  IgnoredTypes
>;