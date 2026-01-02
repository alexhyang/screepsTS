// TODO: add notes about RoomMemory interface here

import { MyRoomName } from "room/RoomAPI";

export class RoomMemoryAPI {
  public static get(myRoomName: MyRoomName, property: string): any {
    return {};
  }

  public static set(myRoomName: MyRoomName, property: string): void {
    return;
  }
}

// TODO: change all direct modification on creep memory to API calls
// Upgrader, JobManager, Squad
export class CreepMemoryAPI {
  /**
   * Return a deep copy of the value of required property
   */
  public static getMem<K extends keyof CreepMemory>(creep: Creep, key: K): CreepMemory[K] | undefined {
    const val: CreepMemory[K] = creep.memory[key];
    return Array.isArray(val) ? ([...val] as CreepMemory[K]) : val;
  }

  public static setMem<K extends keyof CreepMemory>(creep: Creep, key: K, value: CreepMemory[K]): void {
    creep.memory = { ...creep.memory, [key]: value };
  }
}
