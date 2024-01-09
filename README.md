# Deep Utility Types

Utility types for operations on nested objects. Fully type-safe, has nice autocompletion, and works with arrays.

## 📦 Installation

#### NPM
`npm install --save-dev deep-utility-types`

#### Yarn
`yarn add --dev deep-utility-types`

## ⏱️ Quick Start

```typescript
import { DeepOmit } from 'deep-utility-types';

type Example = {
  a: string;
  b: {
    c: string;
    d: {
      e: string;
      f: string;
    };
  };
};

type Omitted = DeepOmit<Example, 'a' | 'b.d.e'>;
```

## 📖 Documentation

### Available Types

* `DeepOmit<Type, Keys>`: Remove specified properties, keeping all others.
* `DeepPick<Type, Keys>`: Keep specified properties, removing all others.
* `DeepRequire<Type, Keys>`: Make specified properties non-optional, keeping all others as is.
* `DeepOptional<Type, Keys>`: Make specified properties optional, keeping all others as is.

> ⚠️ **Note:** The examples below use the `DeepOmit` type, but the same syntax applies to all other types.

### Basic Usage

`DeepOmit<Type, Keys>` is a utility type that takes two generic parameters:

- `Type` - The type to omit properties from
- `Keys` - Keys of the properties to omit

`DeepOmit` can be used like the built-in [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) utility type:

```typescript
type Todo = {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = DeepOmit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};
```

A union of keys can be used to omit multiple properties:

```typescript
type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};
```

### Nested Properties

Unlike `Omit`, `DeepOmit` can omit nested properties:

```typescript
import { DeepOmit } from 'deep-utility-types';

type Example = {
  foo1: string;
  foo2: {
    bar1: string;
    bar2: {
      baz1: string;
      baz2: string;
    };
  };
};

type Omitted = DeepOmit<Example, 'foo2.bar1' | 'foo2.bar2.baz1'>;

const omitted: Omitted = {
  foo1: 'foo1',
  foo2: {
    bar2: {
      baz2: 'baz2',
    },
  },
};
```

When writing the keys you'll see that the autocompletion works as expected:

![Autocompletion](https://i.imgur.com/vyZtSmN.png)

### Arrays

`DeepOmit` works with arrays as well:

```typescript
type Example = Array<{
  foo1: string;
  foo2: Array<{
    bar1: string;
    bar2: string;
  }>;
}>;

type Omitted = DeepOmit<Example, 'foo2.bar2'>

const omitted: Omitted = [
  {
    foo1: 'foo1',
    foo2: [
      {
        bar1: 'bar1',
      }
    ]
  }
];
```

### Ignored Types

An optional third generic parameter can be applied to `DeepOmit` to ignore the properties of certain types. This is especially helpful if your type contains large classes (like most of JavaScript's built-ins) where you don't want their keys to show up in the autocompletion. It can also help with the type-checker's performance on very large types.

```typescript
class SomeLargeClass {
  // Imagine a lot of properties and methods here
}

type Example = {
  foo: string;
  bar: SomeLargeClass;
};

type Omitted = DeepOmit<Example, 'bar', SomeLargeClass>;
```

`DeepOmit` will automatically ignore checking the props of the following types:

- `Function`
- `Number`
- `String`
- `Map<any, any>`
- `Promise<any>`
- `Date`
- `RegExp`
