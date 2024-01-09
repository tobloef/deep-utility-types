export type ArrayType = (unknown[] | readonly unknown[]);
export type IsArray<T> = T extends ArrayType ? true : false;