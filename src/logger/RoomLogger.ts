import RoomAPI from "room/RoomAPI";
import MemoryAPI from "utils/MemoryAPI";
import * as StructureFinder from "structure/StructureFinder";
import {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  getFreeCapacity,
  getUsedCapacity
} from "utils/ResourceManager";
import { padStr, parseNumber, roundTo } from "utils/utils";
import { getRoomCommodityType } from "room/RoomManager";

export default class RoomLogger {
  private room: Room;

  constructor(roomName: MyRoomName) {
    this.room = RoomAPI.getMyRoom(roomName);
  }

  /**
   * Get resource meta data of the room
   *
   * @returns  resource meta as a string
   */
  private getResourceMeta(): string {
    return (
      this.getSpawnsExtensionsEnergyMeta() + ", " + this.getStorageEnergyMeta() + ", " + this.getTerminalResourceMeta()
    );
  }

  /**
   * Get available energy and capacity of available energy in the room
   *
   * @returns  energy meta as a string
   */
  private getSpawnsExtensionsEnergyMeta(): string {
    const energyAvailable = getEnergyAvailable(this.room);
    const energyCapacityAvailable = getEnergyCapacityAvailable(this.room);
    const energyMeta = `${energyAvailable}/${energyCapacityAvailable}`;
    return padStr(energyMeta, 11, true);
  }

  /**
   * Get storage meta data of the room
   *
   * @returns  storage energy meta as a string
   */
  private getStorageEnergyMeta(): string {
    let meta = "N/A";
    const storage = StructureFinder.getStorage(this.room);
    if (storage) {
      const used = getUsedCapacity(storage, RESOURCE_ENERGY);
      const free = getFreeCapacity(storage);
      if (used !== null && free !== null) {
        meta = padStr(parseNumber(used), 7, true) + " U|F " + padStr(parseNumber(free), 7, true);
      }
    }
    return `STG (${meta})`;
  }

  /**
   * Get container meta data of the room
   *
   * @returns  containers energy meta data as a string
   */
  private getContainerMeta(): string {
    let meta = "N/A";
    const numOfContainer = 4;
    const padToLength = 7 * numOfContainer - 2;
    const containers = StructureFinder.getContainers(this.room);

    if (containers.length > 0) {
      const containerMeta = [];
      for (const i in containers) {
        const container = containers[i];
        const used = getUsedCapacity(container, RESOURCE_ENERGY);
        if (used !== null) containerMeta.push(parseNumber(used));
      }
      meta = padStr(containerMeta.join(", "), padToLength, true);
    }
    return `CTN (${meta})`;
  }

  /**
   * Get terminal meta data of the room
   *
   * @returns  terminal resource meta data as a string
   */
  private getTerminalResourceMeta(): string {
    let meta = "N/A";
    const terminal = StructureFinder.getTerminal(this.room);
    if (terminal) {
      const commodityType = getRoomCommodityType(this.room.name);
      const used = getUsedCapacity(terminal, RESOURCE_ENERGY);
      const usedCommodity = getFreeCapacity(terminal, commodityType);
      if (used !== null && usedCommodity !== null) {
        meta =
          `${terminal.cooldown},` +
          padStr(parseNumber(used), 7, true) +
          ", " +
          `${padStr(commodityType, 12, true)} ` +
          padStr(parseNumber(usedCommodity), 7, true);
      }
    }
    return `TMN (${meta})`;
  }

  /**
   * Get defense meta data of room
   *
   * @returns  defense meta data as a string
   */
  private getDefenseMeta(): string {
    let meta = "";
    const defenseConfig = MemoryAPI.get(this.room.name as MyRoomName, "defense");
    if (defenseConfig) {
      const defenseHitsTarget = defenseConfig ? defenseConfig.defenseHitsTarget : 0;
      const repairProgress = this.getDefRepairProgress(defenseHitsTarget);

      const towerAvailableEnergy = _.map(StructureFinder.getTowers(this.room), (t: StructureTower) =>
        getUsedCapacity(t)
      );
      const towerMeta = towerAvailableEnergy.length === 0 ? towerAvailableEnergy.join(",") : "N/A";

      meta =
        `TWR (${padStr(towerMeta, 17)}) ` +
        `WR (${padStr(parseNumber(this.getLowestDefenseHits()), 6, true)}/` +
        `${padStr(parseNumber(defenseHitsTarget), 6, true)}): ` +
        padStr(repairProgress, 7);
    }
    return meta;
  }

  /**
   * Get defense repair progress of the room
   *
   * @returns  defense repair meta data as a string
   */
  private getDefRepairProgress(defenseHitsTarget: number): string {
    const numHealthyWallsRamparts = StructureFinder.getHealthyDefenses(this.room, defenseHitsTarget).length;
    const numUnhealthyWallsRamparts = StructureFinder.getUnhealthyDefenses(this.room, defenseHitsTarget).length;
    return numHealthyWallsRamparts + "/" + `${numHealthyWallsRamparts + numUnhealthyWallsRamparts}`;
  }

  /**
   * Get lowest hits of defenses in the given room
   * @param  roomName
   * @returns  the hits of most unhealthy defense
   */
  private getLowestDefenseHits = (): number => {
    const toDismantle = MemoryAPI.get(this.room.name as MyRoomName, "toDismantle");
    const defenses = StructureFinder.getUnhealthyDefenses(this.room, WALL_HITS_MAX)
      .sort((a: { hits: number }, b: { hits: number }) => a.hits - b.hits)
      .filter((s: { id: any }) => !toDismantle.includes(s.id));
    return defenses.length == 0 ? WALL_HITS_MAX : defenses[0].hits;
  };

  /**
   * Get controller meta data of room with the given name
   *
   * @returns  meta data of controller in room, or undefined
   *    if room name is not included in room config
   */
  private getControllerMeta(): string {
    let meta = "";
    const controller = StructureFinder.getController(this.room);
    if (controller) {
      if (controller.level == 8) {
        meta = `CTRL (8) ${controller.ticksToDowngrade}`;
      } else {
        const current = parseNumber(controller.progress);
        const total = parseNumber(controller.progressTotal);
        const percentage = roundTo(Math.round((controller.progress / controller.progressTotal) * 100), 1);
        meta = `CTRL (${controller.level}): ` + `${percentage}%: ${current}/${total}`;
      }
    }
    return meta;
  }

  /**
   * Print room meta data in console
   */
  public print() {
    const roomMeta =
      "=== " + this.getResourceMeta() + " | " + this.getDefenseMeta() + " | " + this.getControllerMeta() + " ===";
    console.log(roomMeta);
  }
}

// export {
//   getResourceMeta,
//   getDefenseMeta,
//   getLowestDefenseHits,
//   getControllerMeta,
//   getStorageMeta,
//   getContainerMeta,
// };
