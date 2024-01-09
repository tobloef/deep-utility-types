import {DeepOmit, DeepPick, DeepRequire, DeepOptional} from "../src";

type Test1 = {
  foo1: string;
  foo2: {
    bar1: string;
    bar2: Array<{
      baz1: string;
      baz2: string;
    }>
  };
}

type Test2 = {
  foo1?: string;
  foo2?: {
    bar1?: string;
    bar2?: Array<{
      baz1?: string;
      baz2?: string;
    }>
  };
}

type Omitted = DeepOmit<Test1, "foo2.bar2.baz2" | "foo2.bar1">;

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

const omittedBad1: Omitted = {
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

const omittedBad2: Omitted = {
  foo1: "foo1",
  foo2: {
    // @ts-expect-error
    bar1: "bar1",
    bar2: [
      {
        baz1: "baz1",
      },
    ],
  },
}

type Picked = DeepPick<Test1, "foo2.bar1" | "foo2.bar2.baz2">;

const pickedGood: Picked = {
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz2: "baz2",
      }
    ]
  },
}

const pickedBad1: Picked = {
  foo1: "foo1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        // @ts-expect-error
        baz1: "baz1",
        baz2: "baz2",
      },
    ],
  },
}

const pickedBad2: Picked = {
  // @ts-expect-error
  foo1: "foo1",
  foo2: {
    bar1: "bar1",
    bar2: [
      {
        baz2: "baz2",
      },
    ],
  },
}

type Require = DeepRequire<Test2, "foo2.bar2.baz2" | "foo2.bar1">;

const requiredGood1: Require = {
  foo2: {
    bar1: "bar1",
    bar2: [{
      baz2: "baz2",
    }],
  }
}

const requiredGood2: Require = {
  foo1: "bar1",
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

// @ts-expect-error
const requiredBad1: Require = {
  foo1: "bar1",
}

const requiredBad2: Require = {
  foo2: {
    bar1: "bar1",
    bar2: [
      // @ts-expect-error
      {
        baz1: "baz1",
      }
    ],
  }
}

type Optional = DeepOptional<Test1, "foo2.bar2.baz2" | "foo2.bar1">;

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