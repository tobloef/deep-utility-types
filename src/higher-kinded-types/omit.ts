import {HigherKindedType} from "./index";
import {Assume} from "../assume";

export interface HigherKindedOmit extends HigherKindedType {
  new: (
    _Object: Assume<this["_Object"], object>,
    _Keys: Assume<this["_Keys"], keyof typeof _Object>,
  ) => Omit<typeof _Object, typeof _Keys>;
}
