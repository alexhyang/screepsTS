import RoomAPI from "room/RoomAPI";
import { upgradeController } from "creep/CreepActionManager";
import { obtainResource } from "creep/CreepResourceManager";
import { storeIsEmpty, storeIsFull } from "utils/ResourceManager";
import RoleManager from "./RoleManager";

export default class Harvester extends RoleManager {
  public run(creep: Creep): void {
  }
}

// export {
//   run
// };
