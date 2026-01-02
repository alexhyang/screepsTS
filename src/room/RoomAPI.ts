import { RoomConfig } from "./interfaces";
import configW4N12 from "./config.W4N12";
import configW11N5 from "./config.W11N5";

/*
 * Name of my rooms.
 * Must be updated when a new room is claimed, along with constant config in RoomAPI
 */
export enum MyRoomName {
  W4N12 = "W4N12",
  W11N5 = "W11N5",
}


/**
 * The mapping from room name to its configuration.
 * Must be updated when a new room is claimed, along with global enum MyRoom in main.ts
 */
console.log("../main.ts");
const configs: Record<MyRoomName, RoomConfig> = {
  W4N12: configW4N12,
  W11N5: configW11N5
};

export default class RoomAPI {
  /**
   * Get room by name
   * @param  roomName
   * @returns required room
   */
  public static getRoom(roomName: string): Room {
    return Game.rooms[roomName];
  }

  /**
   * Get my room by name
   * @param  roomName
   * @returns required my room
   */
  public static getMyRoom(roomName: MyRoomName): Room {
    return this.getRoom(roomName);
  }

  /**
   * Get the names of my rooms
   *
   * @returns an array of names of my rooms
   */
  public static getMyRooms(): string[] {
    return Object.values(MyRoomName);
  }

  /**
   * Get the config of specified room
   *
   * @param  myRoomName
   *
   * @returns  the configuration object of the specified room
   */
  public static getRoomConfig(myRoomName: MyRoomName): RoomConfig {
    return configs[myRoomName];
  }
}
