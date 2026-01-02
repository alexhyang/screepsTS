import RoomAPI from "room/RoomAPI";
import { Role } from "./role/interfaces";
import * as Roles from "./role/interfaces";

export default class Squad {
  /**
   * Get all creeps by role
   *
   * @param creepRole include all roles if undefined
   * @param roomName include all rooms if undefined
   *
   * @returns  an array of creeps of given role, or empty array if not found
   **/
  public static getTeam(creepRole?: Role, roomName?: MyRoomName): Creep[] {
    if (creepRole === undefined) {
      return _.filter(Game.creeps, creep => creep.room.name === roomName);
    }

    if (roomName === undefined) {
      return _.filter(Game.creeps, creep => creep.memory.role === creepRole);
    }

    return _.filter(Game.creeps, creep => creep.memory.role === creepRole && creep.room.name === roomName);
  }

  /**
   * Get the max size of team in a room
   * @param creepRole
   * @param  roomName
   *
   * @returns  the max size of the team with the given role in the
   *    specified room, or -1 if no config constant can be found
   */
  public static getTeamMaxSize(creepRole: Role, roomName: MyRoomName): number {
    return RoomAPI.getRoomConfig(roomName)[creepRole].teamSize;
  }
}

// export {
//   getTeam,
//   getTeamMaxSize,
// };
