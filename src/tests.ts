import {DeepOmit, DeepPick, DeepRequire, DeepOptional} from "./index";

type Test = {
  foo1: string;
  foo2: {
    bar1: string;
    bar2: Array<{
      baz1: string;
      baz2: string;
    }>
  };
}

type Omitted = DeepOmit<Test, "foo2.bar2.baz2" | "foo2.bar1">;

const omittedGood: Omitted = {
  foo1: "foo1",
  foo2: {
    bar2: [
      {
        baz1: "baz1",
      },
    ],
  },
}

const omittedBad: Omitted = {
  foo1: "foo1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz1: "baz1",
        // @ts-expect-error
        baz2: "baz2",
      },
    ],
  },
}

type Picked = DeepPick<Test, "foo2.bar2.baz2" | "foo2.bar1">;

const pickedGood: Picked = {
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz2: "baz2",
      },
    ],
  }
}

const pickedBad: Picked = {
  foo1: "foo1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz1: "baz1",
        baz2: "baz2",
      },
    ],
  },
}

type Required = DeepRequire<Test, "foo2.bar2.baz2" | "foo2.bar1">;

const requiredGood1: Required = {
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz2: "baz2",
      },
    ],
  }
}

const requiredGood1: Required = {
  bar1: "bar1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz1: "baz1",
        baz2: "baz2",
      },
    ],
  }
}

const requiredBad: Required = {
  bar1: "bar1",
  foo2: {
    bar2: [
      {
        baz1: "baz1",
      },
    ],
  }
}

type Optional = DeepOptional<Test, "foo2.bar2.baz2" | "foo2.bar1">;

const optionalGood1: Optional = {
  foo1: "foo1",
  foo2: {
    bar2: [
      {
        baz1: "baz1",
      },
    ],
  }
}

const optionalGood2: Optional = {
  foo1: "foo1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz1: "baz1",
        baz2: "baz2",
      },
    ],
  }
}
