import {HigherKindedType} from "./index";
import {Require} from "../require";
import {Assume} from "../assume";

export interface HigherKindedRequire extends HigherKindedType {
  new: (
    _Object: Assume<this["_Object"], object>,
    _Keys: Assume<this["_Keys"], keyof typeof _Object>,
  ) => Require<typeof _Object, typeof _Keys>;
}