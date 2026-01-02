import { getRoomCommodityType, getRoomMineralType } from "room/RoomManager";
import {
  getCapacity,
  getUsedCapacity,
  storeHasResource,
  storeHasSpace,
  withdrawFromStorageOk
} from "utils/ResourceManager";
import * as StructFinder from "structure/StructureFinder";
import { CanDeliver, CanHarvest, CanWithdraw, HasStore } from "utils/interfaces";
import * as Roles from "squad/role/interfaces";
import { addCarriedResourceTypes, getCarriedResourceTypes, syncCarriedResourceTypes } from "./CreepMemoryManager";
import { findClosestRuin, findClosestStructureWithResource, findClosestTombstone } from "./CreepRadar";
import { CreepResourceOrigin, RESOURCE, RUIN, SOURCE, TOMBSTONE } from "./interfaces";

const HARVEST_STROKE = "#9e743e"; // brown
const WITHDRAW_STROKE = "#f7052d"; // red
const PICKUP_STROKE = "#f200ff"; // pink
const TRANSFER_STOKE = "#16ff05"; // green

/**
 * Move to and pick up specified resource
 * @param  creep
 * @param  target target resource
 * @returns  true if the pickup is successful, false otherwise
 */
const goPickup = (creep: Creep, target: Resource): boolean => {
  if (!target) {
    return false;
  }

  const resourceType = target.resourceType;
  const pickupResult = creep.pickup(target);
  if (pickupResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: PICKUP_STROKE } });
    return true;
  }

  if (pickupResult === OK) {
    addCarriedResourceTypes(creep, resourceType);
    return true;
  }

  return false;
};

/**
 * Move to and harvest specified target
 * @param  creep
 * @param  target target resource
 * @returns  true if the harvest is successfully scheduled, false otherwise
 */
const goHarvest = (creep: Creep, target: CanHarvest): boolean => {
  if (!target) {
    return false;
  }

  const resourceType =
    target instanceof Source ? RESOURCE_ENERGY : target instanceof Mineral ? target.mineralType : target.depositType;

  const harvestResult = creep.harvest(target);
  if (harvestResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: HARVEST_STROKE } });
    return true;
  }

  if (harvestResult === OK) {
    addCarriedResourceTypes(creep, resourceType);
    return true;
  }

  return false;
};

/**
 * Move to and withdraw the specified resource from given target
 * @param  creep
 * @param  target target structure to withdraw from
 * @param  resourceType RESOURCE_ENERGY by default
 * @returns  true if the withdraw is successful, false otherwise
 */
const goWithdraw = (creep: Creep, target: CanWithdraw, resourceType: ResourceConstant = RESOURCE_ENERGY): boolean => {
  if (!target) {
    return false;
  }

  const withdrawResult = creep.withdraw(target, resourceType);
  if (withdrawResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: WITHDRAW_STROKE } });
    return true;
  }

  if (withdrawResult === OK) {
    addCarriedResourceTypes(creep, resourceType);
    return true;
  }

  return false;
};

/**
 * Deliver specified resource to given target
 * @param  creep
 * @pa am  target
 * @param  resourceType RESOURCE_ENERGY by default
 * @returns  true if transfer is successful, false otherwise
 */
const goDeliver = (creep: Creep, target: CanDeliver, resourceType: ResourceConstant = RESOURCE_ENERGY): boolean => {
  if (!target) {
    return false;
  }

  const deliverResult = creep.transfer(target, resourceType);
  if (deliverResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: TRANSFER_STOKE } });
    return true;
  }

  if (deliverResult === OK) {
    syncCarriedResourceTypes(creep);
    return true;
  }

  return false;
};

/**
 * Harvest resource from the given target
 * @param  creep
 * @param  target target to harvest from
 * @returns  true if assignment is successful, false otherwise
 */
const harvestFrom = (creep: Creep, target: CanHarvest): boolean => {
  return goHarvest(creep, target);
};

/**
 * Withdraw the resource of given type from structure if it has enough resources
 * @param  creep
 * @param  target target structure to withdraw from
 * @param  resourceType RESOURCE_ENERGY by default
 * @returns  true if the withdraw is successful, false otherwise
 */
const withdrawFrom = (
  creep: Creep,
  target: HasStore & CanWithdraw,
  resourceType: ResourceConstant = RESOURCE_ENERGY
): boolean => {
  if (storeHasResource(target, resourceType)) {
    return goWithdraw(creep, target, resourceType);
  }

  return false;
};

/**
 * Transfer specified resource type from one structure to another
 * @param  creep
 * @param  from
 * @param  to
 * @param  resourceType
 * @returns  true if transfer is successfully scheduled, false otherwise
 */
const transferBetween = (
  creep: Creep,
  from: HasStore & CanWithdraw,
  to: HasStore & CanDeliver,
  resourceType: ResourceConstant = RESOURCE_ENERGY
): boolean => {
  if (creep.ticksToLive === undefined || creep.ticksToLive < 10) {
    return false;
  }

  if (
    !storeHasResource(creep, resourceType) &&
    storeHasSpace(creep, resourceType) &&
    withdrawFrom(creep, from, resourceType)
  ) {
    return true;
  } else {
    return goDeliver(creep, to, resourceType);
  }
};

/**
 * Transfer all carried resource types listed in memory to the target structure
 * @param  creep
 * @param  target target structure
 * @returns true if the transfer is scheduled successfully, false otherwise
 */
const emptyResourceTypes = <T extends Structure = StructureStorage>(creep: Creep, target: T): boolean => {
  if (!target || !creep) {
    return false;
  }

  const resourceTypes = getCarriedResourceTypes(creep);
  if (resourceTypes !== undefined && resourceTypes.length > 0) {
    goDeliver(creep, target, resourceTypes[0]);
    return true;
  }

  return false;
};

/**
 * Pick up nearby dropped resource (for miners and extractors)
 * @param  creep
 * @param  resourceType
 * @returns  true if the pickup if successful, false otherwise
 */
const pickupNearbyResource = (creep: Creep, resourceType: ResourceConstant, dist = 3): boolean => {
  const resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES, dist)[0];
  if (resource && resource.resourceType === resourceType) {
    return goPickup(creep, resource);
  }
  return false;
};

/**
 * Pick up the closest dropped resource (energy for builders and repairers, all for harvester)
 * @param  creep
 * @returns  true if pickup is successful, false otherwise
 */
const pickupDroppedResources = (creep: Creep): boolean => {
  const droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
  const MAX_PICKUP_RANGE = 25;
  const MIN_PICKUP_AMT = 10;

  if (
    droppedResource === null ||
    creep.pos.getRangeTo(droppedResource) > MAX_PICKUP_RANGE ||
    droppedResource.amount < MIN_PICKUP_AMT
  ) {
    return false;
  }

  if (droppedResource.resourceType === RESOURCE_ENERGY) {
    return goPickup(creep, droppedResource);
  }

  if (creep.memory.role !== Roles.BEE) {
    return false;
  }

  return goPickup(creep, droppedResource);
};

/**
 * Withdraw from a hostile creep tombstone
 * @param  creep
 * @param  tombstone
 * @returns  true if the withdraw is successful, false otherwise
 */
// TODO: check if this implementation works properly
const withdrawFromTombstone = (creep: Creep): boolean => {
  const closestTombstone = findClosestTombstone(creep);
  if (closestTombstone === null || creep.pos.getRangeTo(closestTombstone) > 50) {
    return false;
  }

  let newResourcesTypes: ResourceConstant[] = [RESOURCE_ENERGY];
  if (creep.memory.role === Roles.BEE) {
    newResourcesTypes = [
      getRoomMineralType(creep.room.name),
      getRoomCommodityType(creep.room.name),
      RESOURCE_GHODIUM_OXIDE,
      RESOURCE_ZYNTHIUM_HYDRIDE,
      RESOURCE_KEANIUM_OXIDE,
      RESOURCE_UTRIUM_HYDRIDE,
      RESOURCE_LEMERGIUM_OXIDE,
      RESOURCE_ENERGY
    ];
  }

  while (newResourcesTypes.length > 0) {
    newResourcesTypes = newResourcesTypes.filter((r: ResourceConstant) => storeHasResource(closestTombstone, r));
    return withdrawFrom(creep, closestTombstone, newResourcesTypes[0]);
  }

  return false;
};

/**
 * Withdraw from the closest ruin
 * @param  creep
 * @returns  true if the withdraw is successful, false otherwise
 */
const withdrawFromRuin = (creep: Creep): boolean => {
  const closestRuin = findClosestRuin(creep);
  if (closestRuin !== null) {
    return withdrawFrom(creep, closestRuin);
  }
  return false;
};

/**
 * Withdraw from the closest container
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromContainer = (creep: Creep): boolean => {
  const creepCapacity = getCapacity(creep);
  if (creepCapacity === null) {
    return false;
  }

  const containers = StructFinder.getContainers(creep.room)
    .sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))
    .filter((c: StructureContainer) => {
      const usedCapacity = getUsedCapacity(c);
      return usedCapacity !== null ? usedCapacity >= creepCapacity : false;
    });

  if (containers.length === 0) {
    return false;
  }

  if (creep.memory.role === Roles.BEE) {
    const roomMineralType = getRoomMineralType(creep.room.name);
    if (withdrawFrom(creep, containers[0], roomMineralType)) {
      console.log(creep.room.name, "withdrawing", roomMineralType, "from container");
      return true;
    }
  }

  return withdrawFrom(creep, containers[0]);
};

/**
 * @param  creep
 * @returns  true if the withdraw is successful, false otherwise
 */
const withdrawFromStorage = (creep: Creep): boolean => {
  const storage = StructFinder.getStorage(creep.room);
  if (storage !== undefined && withdrawFromStorageOk(creep.room)) {
    return withdrawFrom(creep, storage);
  }
  return false;
};

/**
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromTerminal = (creep: Creep): boolean => {
  const terminal = StructFinder.getTerminal(creep.room);
  if (terminal !== undefined) {
    return withdrawFrom(creep, terminal);
  }
  return false;
};

/**
 * Withdraw from the closest link
 * @param  creep
 * @returns  true if the withdraw is successful, false otherwise
 */
const withdrawFromLink = (creep: Creep, dist = 5): boolean => {
  const MIN_WITHDRAWAL_AMT = 400;
  const closestLink = findClosestStructureWithResource(creep, STRUCTURE_LINK) as StructureLink;
  if (
    closestLink !== null &&
    creep.pos.inRangeTo(closestLink, dist) &&
    storeHasResource(closestLink, undefined, MIN_WITHDRAWAL_AMT)
  ) {
    return withdrawFrom(creep, closestLink);
  }
  return false;
};

/**
 * Harvest from the closest source
 * @param  creep
 * @param  sourceId
 * @returns  true if the assignment is successful, false otherwise
 */
const harvestFromSource = (creep: Creep, sourceId = 0): boolean => {
  const sources = creep.room.find(FIND_SOURCES);
  if (sources[sourceId] === null) {
    return false;
  }
  return harvestFrom(creep, sources[sourceId]);
};

/**
 * Returns the method to obtain resources
 * @param  origin
 * @returns  the function to obtain resources
 */
const retreiveHarvestMethod = (origin: CreepResourceOrigin): ((creep: Creep) => boolean) => {
  switch (origin) {
    case RESOURCE:
      return pickupDroppedResources;
    case TOMBSTONE:
      return withdrawFromTombstone;
    case RUIN:
      return withdrawFromRuin;
    case STRUCTURE_LINK:
      return withdrawFromLink;
    case STRUCTURE_CONTAINER:
      return withdrawFromContainer;
    case STRUCTURE_TERMINAL:
      return withdrawFromTerminal;
    default: // get resource from storage by default
      return withdrawFromStorage;
  }
};

/**
 * Obtain resource from the given origins in order
 * @param  creep
 * @param  resourceOrigins an array of origins of resource
 */
const obtainResource = (creep: Creep, resourceOrigins: CreepResourceOrigin[], sourceId = 0) => {
  for (const i in resourceOrigins) {
    const origin = resourceOrigins[i];
    if (origin !== SOURCE) {
      const harvestMethod = retreiveHarvestMethod(origin);
      if (harvestMethod(creep)) {
        break;
      }
    } else {
      harvestFromSource(creep, sourceId);
    }
  }
};

export { transferBetween, emptyResourceTypes, obtainResource };
