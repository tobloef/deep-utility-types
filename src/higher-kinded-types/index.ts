export * from "./omit";
export * from "./optional";
export * from "./pick";
export * from "./require";

// https://code.lol/post/programming/higher-kinded-types/

type GenericFunction = (...x: never[]) => unknown;

export abstract class HigherKindedType {
  readonly _Object?: unknown;
  readonly _Keys?: unknown;
  new!: GenericFunction;
}

export type ApplyHigherKindedType<
  F extends HigherKindedType,
  _Object extends object,
  _Keys extends keyof _Object,
> = ReturnType<
  (F & {
    readonly _Object: _Object;
    readonly _Keys: _Keys;
  })["new"]
>;