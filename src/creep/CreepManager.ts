import { Role } from "squad/role/interfaces";
import RoomAPI from "room/RoomAPI";

/**
 * Get the metadata of a creep
 * @param {Creep} creep
 * @returns {string} the meta data of the given creep
 */
const getCreepMeta = (creep: Creep): string => {
  const lifeLeft = creep.ticksToLive;
  const fatigue = creep.fatigue;
  const carry = creep.store[RESOURCE_ENERGY];
  const carryMax = creep.store.getCapacity(RESOURCE_ENERGY);
  return `(${lifeLeft || "NA"}, ${carry}/${carryMax}, ${fatigue})`;
};

/**
 * Get the summary of body part count
 * @param {Creep} creep
 * @returns {Object.<string, number>} an object with part as key and count as
 *    value, return undefined if all parts are lost
 */
const getCreepBodyPartCount = (creep: Creep): { [s: string]: number } => {
  const bodyPartCount: { [s: string]: number } = {};
  creep.body.map(body => {
    if (!(body.type in bodyPartCount)) {
      bodyPartCount[body.type] = 0;
    }
    if (body.hits > 0) {
      bodyPartCount[body.type]++;
    }
  });
  return bodyPartCount;
};

/**
 * Get body parts of a creep
 * @param {Creep} creep
 * @returns {string} body parts the given creep
 */
const getCreepBodyParts = (creep: Creep): string => {
  const bodyParts = [];
  const bodyPartCount = getCreepBodyPartCount(creep);
  for (const partType in bodyPartCount) {
    bodyParts.push(`${partType}: ${bodyPartCount[partType]}`);
  }
  return `(${bodyParts.join(", ")})`;
};

/**
 * Get creep by name
 *
 * @param  creepName name of the creep to find
 * @returns creep with the given name, undefined if not found
 */
const getCreep = (creepName: string) => {
  return Game.creeps[creepName];
};

/**
 * Change the role of a creep
 * @param  creep
 * @param  newRole new role
 */
const changeCreepRole = (creep: Creep, newRole: Role) => {
  creep.memory = { ...creep.memory, role: newRole };
};

/**
 * Change the role of a creep with given name
 *
 * @param  creepName name of the creep
 * @param  newRole new role
 */
const changeCreepRoleByName = (creepName: string, newRole: Role) => {
  let debugMode: boolean;
  const creep = getCreep(creepName);
  const roomName = creep.room.name;
  if (creep && RoomAPI.getMyRooms().includes(roomName)) {
    debugMode = RoomAPI.getRoomConfig(roomName as MyRoomName).spawn.debugMode;
    if (debugMode) {
      changeCreepRole(creep, newRole);
    } else {
      console.log("Change Rejected! Turn on debug mode for room: ", roomName, "\n");
    }
  }
};

export { getCreep, getCreepMeta, getCreepBodyParts, changeCreepRole, changeCreepRoleByName };
