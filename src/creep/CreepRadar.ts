import * as StructFinder from "structure/StructureFinder";
import { HasStore } from "utils/interfaces";
import { storeHasResource, storeHasSpace } from "utils/ResourceManager";

/**
 * Find the closest tombstone from the creep with the specified resource type
 * @param  creep
 * @param  resourceType
 * @returns  the closest tombstone, or null if not found
 */
const findClosestTombstone = (creep: Creep, resourceType: ResourceConstant = RESOURCE_ENERGY): Tombstone | null => {
  const tombstones = _.filter(creep.room.find(FIND_TOMBSTONES), d => d.store.getUsedCapacity(resourceType) > 0);
  return creep.pos.findClosestByRange(tombstones);
};

/**
 * Find the closest ruin from the creep with the specified resource type
 * @param  creep
 * @param  resourceType
 * @returns  the closest ruin, or null if not found
 */
const findClosestRuin = (creep: Creep, resourceType: ResourceConstant = RESOURCE_ENERGY): Ruin | null => {
  const ruins = _.filter(creep.room.find(FIND_RUINS), d => d.store.getUsedCapacity(resourceType) > 0);
  return creep.pos.findClosestByRange(ruins);
};

/**
 * Find the closest structure from a list of structures
 * @param  creep
 * @param  structures structures to search
 * @returns  the closest structure, or null if not found
 */
const findClosestStructure = (creep: Creep, structures: Structure[]): Structure | null => {
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest structure of type specified by the find constant
 * @param  creep
 * @param  structureType the STRUCTURE_* constant
 * @returns  the closest structure with specified type, or null if not found
 */
const findClosestStructureWithResource = (creep: Creep, structureType: StructureConstant): Structure | null => {
  const structures = _.filter(StructFinder.getStructures(creep.room, structureType), (s: HasStore) =>
    storeHasResource(s)
  );
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest structure of type specified by the find constant
 * @param  creep
 * @param  structureType the STRUCTURE_* constant
 * @returns  the closest structure with specified type, or null if not found
 */
const findClosestStructureWithFreeCapacity = (creep: Creep, structureType: StructureConstant): Structure | null => {
  const structures = _.filter(StructFinder.getStructures(creep.room, structureType), (s: HasStore) => storeHasSpace(s));
  return creep.pos.findClosestByRange(structures);
};

export {
  findClosestRuin,
  findClosestTombstone,
  findClosestStructure,
  findClosestStructureWithResource,
  findClosestStructureWithFreeCapacity
};
