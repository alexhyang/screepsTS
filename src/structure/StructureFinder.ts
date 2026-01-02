// import GameUtils from "../utils/GameUtils";

/**
 * Find all structures of specified type in the room
 * @param  structureType
 *
 * @returns  an array of structures, or empty array if not found
 */
function getStructures(room: Room, structureType: StructureConstant): Structure[] {
  return room.find(FIND_STRUCTURES, {
    filter: { structureType }
  });
}

/**
 * Find structures of the given type
 * @param  structureType
 *
 * @returns  an array of specified structures in the room
 */
function getStructuresByType<T>(room: Room, structureType: StructureConstant): T[] {
  const results = getStructures(room, structureType);
  return results as T[];
}

/**
 * Find the spawn with given spawn name
 * @param  spawnName
 *
 * @returns  the spawn with the given name, or undefined if not found
 */
function getSpawnByName(spawnName: string): StructureSpawn | undefined {
  return Game.spawns[spawnName];
}

/**
 * Find all spawns in the room
 *
 * @returns  an array of spawns in the room, or empty array if not found
 */
function getSpawns(room: Room): StructureSpawn[] {
  /** Update spawns in memory */
  // const updateSpawns = () => {
  //   let spawns = getStructures(STRUCTURE_SPAWN);
  //   Memory.structures[room.name].spawns = spawns.map(s => s.id);
  // }
  //
  // if (!Memory.structures[room.name].spawns) updateSpawns();
  // let spawns = Memory.structures[room.name].spawns.map(gameUtils.getById);
  // if (spawns.includes(null)) updateSpawns();
  // return spawns;
  return getStructuresByType<StructureSpawn>(room, STRUCTURE_SPAWN);
}

/**
 * Find the controller in the room
 *
 * @returns  the controller in the room, or undefined if not found
 */
function getController(room: Room): StructureController | undefined {
  return room.controller;
}

/**
 * Find all containers in the room
 *
 * @returns  an array of containers in the room, or empty array if not found
 */
function getContainers(room: Room): StructureContainer[] {
  /** Update containers in memory */
  // const updateContainers = () => {
  //   let containers = getStructures(STRUCTURE_CONTAINER, room);
  //   Memory.structures[room.name].containers = containers.map(s => s.id);
  // }
  //
  // if (Game.time % 1000 == 0) updateContainers();
  // let containers = Memory.structures[room.name].containers.map(gameUtils.getById);
  // if (containers.includes(null)) updateContainers();
  // return containers;
  return getStructuresByType<StructureContainer>(room, STRUCTURE_CONTAINER);
}

/**
 * Find the storage in the room
 *
 * @returns  the storage in the room, or undefined if not found
 */
function getStorage(room: Room): StructureStorage | undefined {
  return room.storage;
}

/**
 * Find all towers in the room
 *
 * @returns  an array of towers in the room, or empty array if not found
 */
function getTowers(room: Room): StructureTower[] {
  /** Update towers in memory */
  // const updateTowers = () => {
  //   let towers = getStructures(STRUCTURE_TOWER, room);
  //   Memory.structures[room.name].towers = towers.map(t => t.id);
  // }
  //
  // if (!Memory.structures[room.name].towers) updateTowers();
  //
  // let towers = Memory.structures[room.name].towers.map(gameUtils.getById);
  // if (towers.includes(null)) updateTowers();
  // return towers;
  return getStructuresByType<StructureTower>(room, STRUCTURE_TOWER);
}

/** Find all extensions in the room
 *
 * @returns  an array of extensions in the room, or empty array if not found
 */
function getExtensions(room: Room): StructureExtension[] {
  /** Update extensions in memory */
  // const updateExtensions = () => {
  //   let extensions = getStructures(STRUCTURE_EXTENSION, room);
  //   Memory.structures[room.name].extensions = extensions.map(e => e.id);
  // }
  //
  // if (!Memory.structures[room.name].extensions) updateExtensions();
  // let extensions = Memory.structures[room.name].extensions.map(gameUtils.getById);
  // if (extensions.includes(null)) updateExtensions();
  // return extensions;
  return getStructuresByType<StructureExtension>(room, STRUCTURE_EXTENSION);
}

/** Find all links in the room
 *
 * @returns  an array of extensions in the room, or empty array if not found
 */
function getLinks(room: Room): StructureLink[] {
  return getStructuresByType<StructureLink>(room, STRUCTURE_LINK);
}

/** Find all labs in the room
 *
 * @returns  an array of extensions in the room, or empty array if not found
 */
function getLabs(room: Room): StructureLab[] {
  return getStructuresByType<StructureLab>(room, STRUCTURE_LAB);
}

/** Find extractor in the room
 *
 * @returns the extractor in the room, or undefined if not found
 */
function getExtractor(room: Room): StructureExtractor | undefined {
  // if (!Memory.structures[room.name].extractor) {
  //   let extractor = getStructures(STRUCTURE_EXTRACTOR, room)[0];
  //   Memory.structures[room.name].extractor = extractor.id;
  //   return extractor;
  // }
  //
  // return gameUtils.getById(Memory.structures[room.name].extractor);
  return getStructuresByType<StructureExtractor>(room, STRUCTURE_EXTRACTOR)[0];
}

/** Find terminal in the room
 *
 * @returns  the terminal in the room, or undefined if not found
 */
function getTerminal(room: Room): StructureTerminal | undefined {
  // if (!Memory.structures[room.name].terminal) {
  //   let terminal = getStructures(STRUCTURE_TERMINAL, room)[0];
  //   Memory.structures[room.name].terminal = terminal.id;
  //   return terminal;
  // }
  //
  // return gameUtils.getById(Memory.structures[room.name].terminal);
  return getStructuresByType<StructureTerminal>(room, STRUCTURE_TERMINAL)[0];
}

/** Find nuker in the room
 *
 * @returns  the terminal in the room, or undefined if not found
 */
function getNuker(room: Room): StructureNuker | undefined {
  return getStructuresByType<StructureNuker>(room, STRUCTURE_NUKER)[0];
}

/** Find factory in the room
 *
 * @returns  the terminal in the room, or undefined if not found
 */
function getFactory(room: Room): StructureFactory | undefined {
  // if (!Memory.structures[room.name].factory) {
  //   let factory = getStructures(STRUCTURE_FACTORY, room)[0];
  //   Memory.structures[room.name].factory = factory.id;
  //   return factory;
  // }
  //
  // return gameUtils.getById(Memory.structures[room.name].factory);
  return getStructuresByType<StructureFactory>(room, STRUCTURE_FACTORY)[0];
}

/** Find ramparts in the room
 *
 * @returns  the ramparts in the room, or undefined if not found
 */
// function getRamparts(room: Room): StructureRampart[] {
//   return getStructuresByType<StructureRampart>(room, STRUCTURE_RAMPART);
// }

/**
 * Update Walls and Ramparts cache in memory
 */
function getWallRamps(room: Room): Structure[] {
  const wallRamps = room.find(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
  });
  // TODO: cache in Memory
  // console.log("updating wallramps: ", room.name);
  // Memory.structures[room.name].wallRamps = wallRamps.map(s => s.id);
  return wallRamps;
}

/**
 * Find all unhealthy walls and ramparts
 *
 * @param  minHealthyHits minimum hits of healthy defenses
 *
 * @returns  an array of unhealthy walls and ramparts, or empty array if not found
 */
function getUnhealthyDefenses(room: Room, minHealthyHits: number): Structure[] {
  // if (!Memory.structures[room.name].wallRamps) getWallRamps();
  // let wallRamps = Memory.structures[room.name].wallRamps.map(gameUtils.getById);
  // if (Game.time % 28800 == 0 || wallRamps.includes(null)) getWallRamps();
  //
  // return wallRamps.filter(s => s.hits < minHealthyHits);
  return getWallRamps(room).filter((s: Structure) => s.hits < minHealthyHits);
}

/**
 * Find all healthy walls and ramparts
 *
 * @param  minHealthyHits minimum hits of healthy defenses
 *
 * @returns  an array of healthy walls and ramparts, or empty array if not found
 */
function getHealthyDefenses(room: Room, minHealthyHits: number): Structure[] {
  // if (!Memory.structures[room.name].wallRamps) updateWallRamps(room);
  // let wallRamps = Memory.structures[room.name].wallRamps.map(gameUtils.getById);
  // if (Game.time % 28800 == 0 || wallRamps.includes(null)) updateWallRamps(room);
  //
  // return wallRamps.filter(s => s.hits >= minHealthyHits);
  return getWallRamps(room).filter((s: Structure) => s.hits >= minHealthyHits);
}

/**
 * Find all damaged/decayed structures for repair
 *
 * @param  structureType
 *
 * @returns  an array of decayed structures, or empty array if not found
 */
function getDamagedStructures(room: Room, structureType: StructureConstant): Structure[] {
  const targets = room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType == structureType && structure.hits < structure.hitsMax
  });
  return targets;
}

export {
  getStructures,
  getSpawnByName,
  getSpawns,
  getExtensions,
  getController,
  getStorage,
  getContainers,
  getTowers,
  getLinks,
  getLabs,
  getExtractor,
  getTerminal,
  getNuker,
  getFactory,
  getUnhealthyDefenses,
  getHealthyDefenses,
  getDamagedStructures
};
