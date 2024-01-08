import {HigherKindedType} from "./index";
import {Optional} from "../optional";
import {Assume} from "../assume";

export interface HigherKindedOptional extends HigherKindedType {
  new: (
    _Object: Assume<this["_Object"], object>,
    _Keys: Assume<this["_Keys"], keyof typeof _Object>,
  ) => Optional<typeof _Object, typeof _Keys>;
}