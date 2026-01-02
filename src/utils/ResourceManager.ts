import RoomAPI, { MyRoomName } from "room/RoomAPI";
import { HasStore } from "./interfaces";
import * as StructureFinder from "structure/StructureFinder";

/**
 * Shorthand for roomObj.store.getUsedCapacity()
 *
 * @param  roomObj
 * @param  resourceType
 *
 * @returns  used capacity of specified resource type, null if resource type is invalid
 */
const getUsedCapacity = (roomObj: HasStore, resourceType?: ResourceConstant): number | null => {
  if (!roomObj) return null;
  return roomObj.store.getUsedCapacity(resourceType);
};

/**
 * Shorthand for roomObj.store.getFreeCapacity()
 *
 * @param  roomObj
 * @param  resourceType
 *
 * @returns  free capacity of specified resource type, null if resource type is invalid
 */
const getFreeCapacity = (roomObj: HasStore, resourceType?: ResourceConstant): number | null => {
  return roomObj.store.getFreeCapacity(resourceType);
};

/**
 * Shorthand for roomObj.store.getCapacity()
 *
 * @param  roomObj
 * @param  resourceType
 *
 * @returns  resource capacity of specified room object, null if resource type is invalid
 */
const getCapacity = (roomObj: HasStore, resourceType?: ResourceConstant): number | null => {
  return roomObj.store.getCapacity(resourceType);
};

/**
 * Determine if a store of a room object
 *
 * @param  roomObj
 *
 * @returns  true if store is empty, false otherwise
 */
const storeIsEmpty = (roomObj: HasStore): boolean => {
  return getUsedCapacity(roomObj, undefined) === 0;
};

/**
 * Determine if the store of a room object is full
 *
 * @param  roomObj
 *
 * @returns  true if store is full, false otherwise
 */
const storeIsFull = (roomObj: HasStore): boolean => {
  return getFreeCapacity(roomObj, undefined) === 0;
};

/**
 * Determine if the store of a room object has the specified resource greater than
 *    or equal to the minimum amount. If the minimum amount is undefined,
 *    return true if it has the specified resource, false otherwise.
 *
 * @param  roomObj
 * @param  minAmount minimum used capacity
 * @param  resourceType
 *
 * @returns true if store has specified resource with given minimum amount, false otherwise
 */
const storeHasResource = (roomObj: HasStore, resourceType?: ResourceConstant, minAmount?: number): boolean => {
  if (!roomObj) {
    return false;
  }

  const usedCapacity = getUsedCapacity(roomObj, resourceType);
  return usedCapacity === null
    ? false
    : minAmount === undefined || minAmount <= 0
      ? usedCapacity > 0
      : usedCapacity >= minAmount;
};

/**
 * Determine if the store of a room object has space for the specified resource
 *    for at least the given minimum amount. If the minimum amount if undefined,
 *    return true if it has free capacity, false otherwise.
 *
 * @param  roomObj
 * @param  minAmount minimum free capacity
 * @param  resourceType
 *
 * @returns true if store has specified resource with given minimum amount, false otherwise
 */
const storeHasSpace = (roomObj: HasStore, resourceType?: ResourceConstant, minAmount?: number): boolean => {
  if (!roomObj) {
    return false;
  }

  const freeCapacity = getFreeCapacity(roomObj, resourceType);
  return freeCapacity === null
    ? false
    : minAmount === undefined || minAmount <= 0
      ? freeCapacity > 0
      : freeCapacity >= minAmount;
};

/**
 * Get the energy available in the room
 * @param  room
 * @returns  the available energy in the given room
 */
const getEnergyAvailable = (room: Room): number => {
  return room ? room.energyAvailable : 0;
};

/**
 * Get the energy capacity available in the room
 * @param  room
 * @returns the available energy capacity of room with the given name
 */
const getEnergyCapacityAvailable = (room: Room) => {
  return room ? room.energyCapacityAvailable : 0;
};

/**
 * Determine if sources in the specified room are empty
 * @param  room
 * @returns  true if all sources are empty, false otherwise
 */
const allSourcesAreEmpty = (room: Room): boolean => {
  const sources = room.find(FIND_SOURCES);
  return sources.filter(s => s.energy > 0).length === 0;
};

/**
 * Determine if it's ok to withdraw energy from storage in the room
 * @param  room
 * @returns  true if it is okay to withdraw from storage in the given
 *    room, false otherwise
 **/
const withdrawFromStorageOk = (room: Room): boolean => {
  const roomName = room.name as MyRoomName;
  const { STORAGE_WITHDRAW_THRESHOLD } = RoomAPI.getRoomConfig(roomName);
  const storage = StructureFinder.getStorage(room);

  if (storage === undefined) {
    return false;
  }

  const usedCapacity = getUsedCapacity(storage);
  return usedCapacity === null ? false : allSourcesAreEmpty(room) || usedCapacity >= STORAGE_WITHDRAW_THRESHOLD;
};

export {
  getUsedCapacity,
  getFreeCapacity,
  getCapacity,
  storeIsEmpty,
  storeIsFull,
  storeHasResource,
  storeHasSpace,
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromStorageOk
};
