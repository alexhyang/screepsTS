import * as StructureFinder from "structure/StructureFinder";

const REPAIR_STROKE = "#fffb05"; // yellow
const BUILD_STROKE = "#fffb05"; // yellow
const UPGRADE_STROKE = "#1205ff"; // blue

/**
 * Dismantle the given structure
 * @param  creep
 * @param  structure
 * @returns  true if the task assignment is successful, false otherwise
 */
const dismantleStructure = (creep: Creep, structure: Structure): boolean => {
  if (structure) {
    if (creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
      creep.moveTo(structure);
    }
    return true;
  }
  return false;
};

/**
 * Build the given construction site
 * @param  creep
 * @param  target
 */
const buildTarget = (creep: Creep, target: ConstructionSite) => {
  if (target !== null && target !== undefined) {
    if (creep.build(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: BUILD_STROKE } });
    }
  }
};

/**
 * Build the given construction site by its id
 * @param  creep
 * @param  targetId
 */
const buildTargetById = (creep: Creep, targetId: Id<ConstructionSite>) => {
  const target = Game.getObjectById<ConstructionSite>(targetId);
  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Build the closest construction site if any
 * @param {Creep} creep
 */
const buildClosestConstructionSite = (creep: Creep, buildingPriority = "none") => {
  const filter = buildingPriority === "none" ? () => true : (s: Structure) => s.structureType === buildingPriority;

  const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    filter
  });

  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Repair the given target
 * @param {Creep} creep
 * @param {Structure} target
 */
const repairTarget = (creep: Creep, target: Structure) => {
  if (target !== null) {
    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: REPAIR_STROKE } });
    }
  }
};

/**
 * Let a creep claim the controller in its room, show error message if not
 *   successful
 * @param {Creep} creep
 */
const claimController = (creep: Creep) => {
  if (creep.room.controller) {
    const controller = creep.room.controller;
    if (creep.claimController(controller) === ERR_NO_BODYPART) {
      console.log(`Creep ${creep.name} does not have CLAIM part`);
    } else if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
  }
};

/**
 * Upgrade controller
 * @param {Creep} creep
 */
const upgradeController = (creep: Creep) => {
  const controller = StructureFinder.getController(creep.room);
  if (controller !== undefined) {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, {
        visualizePathStyle: { stroke: UPGRADE_STROKE }
      });
    }
  }
};

/**
 * Sign controller in the room
 * @param {Creep} creep
 * @param {string} signMsg
 */
const signController = (creep: Creep, signMsg: string) => {
  if (creep.room.controller) {
    if (creep.signController(creep.room.controller, signMsg) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
};

/**
 * Move a creep to a given position
 * @param {Creep} creep
 * @param {number} x x-coordinate of position: 0 <= x < = 49
 * @param {number} y y-coordinate of position: 0 <= y <= 49
 * @param {string} roomName name of the destination room
 */
const moveToPosition = (creep: Creep, x: number, y: number, roomName = "") => {
  if (creep) {
    const targetRoomName = roomName !== "" ? roomName : creep.room.name;
    creep.moveTo(new RoomPosition(x, y, targetRoomName));
  }
};

/**
 * Find structures in the given range
 * @param {Creep} creep
 * @param {string} structureType
 * @param {number} range
 * @returns {Structure[]} array of structures in the specified range
 */
const findStructuresInRange = (creep: Creep, structureType: string, range: number): Structure[] => {
  return creep.pos.findInRange(FIND_STRUCTURES, range, {
    filter: { structureType }
  });
};

export {
  buildClosestConstructionSite,
  buildTargetById,
  repairTarget,
  dismantleStructure,
  claimController,
  upgradeController,
  signController,
  moveToPosition,
  findStructuresInRange
};
