// For some reason we have to do the check twice
export type IsNever<T> = (T extends never ? never : T) extends never ? true : false;