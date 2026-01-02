import RoomAPI, { MyRoomName } from "room/RoomAPI";
import { upgradeController } from "creep/CreepActionManager";
import { obtainResource } from "creep/CreepResourceManager";
import { storeIsEmpty, storeIsFull } from "utils/ResourceManager";
import RoleManager from "./RoleManager";

export default class Upgrader extends RoleManager {
  /**
   * Update upgrading status of a creep
   * @param {Creep} creep
   */
  public updateUpgradingStatus(creep: Creep) {
    if (creep.memory.upgrading && storeIsEmpty(creep)) {
      creep.memory.upgrading = false;
      creep.say("🔄");
    }

    if (!creep.memory.upgrading && storeIsFull(creep)) {
      creep.memory.upgrading = true;
      creep.say("⚡");
    }
  };

  /**
   * Let creep obtain energy for upgrading
   * @param {Creep} creep
   */
  public obtainEnergy(creep: Creep) {
    const { sourceOrigins, sourceIndex } = RoomAPI.getRoomConfig(
      creep.room.name as MyRoomName
    ).upgrader;
    obtainResource(creep, sourceOrigins, sourceIndex);
  };

  /** @param {Creep} creep **/
  public run(creep: Creep) {
    console.log("running upgrader...");
    this.updateUpgradingStatus(creep);
    if (creep.memory.upgrading) {
      upgradeController(creep);
    } else {
      this.obtainEnergy(creep);
    }
  }
}

// export {
//   run
// };
