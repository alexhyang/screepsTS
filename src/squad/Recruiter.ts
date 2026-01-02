import CreepModelAnalyzer from "creep/CreepModelAnalyzer";
import MODELS from "creep/CreepModels";
import RoomAPI from "room/RoomAPI";
import Squad from "./Squad";
import { getEnergyAvailable } from "utils/ResourceManager";
import { CreepModel } from "creep/interfaces";
import { BEAVER, BEE, CHEMIST, DIGGER, ENGINEER, HAULER, RESEARCHER, Role, SEAL } from "./role/interfaces";
import { RecruitStrategy } from "./interfaces";
import { RoomConfig } from "room/interfaces";
import * as StructureFinder from "structure/StructureFinder";

/**
 * Generate name for new creep
 * @param  creepModel
 * @param  creepName
 * @returns  given creep name, or modelName-timestamp
 */
const generateCreepName = (creepModel: CreepModel, creepName?: string): string => {
  return creepName ? creepName : creepModel.name + "-" + (Game.time % 100);
};

/**
 * Print information about the creep being spawned
 * @param  spawn
 * @param  creepName
 * @param  creepRole
 * @param  spawningCost
 */
const printCreepSpawningMsg = (spawn: StructureSpawn, creepName: string, creepRole: Role, spawningCost: number) => {
  let remainingTime;
  if (spawn.spawning) {
    remainingTime = `(${spawn.spawning.remainingTime})`;
  }
  console.log(
    `${spawn.room.name}-${spawn.name} Spawning new ${creepRole}:`,
    creepName,
    `(${spawningCost})`,
    remainingTime
  );
};

/**
 * Get the first available spawn to creep spawning
 * @param  spawnNames a list of spawn names to check
 * @returns  idle spawn, undefined if all spawns are busy
 */
const getIdleSpawn = (spawnNames: string[]): StructureSpawn | undefined => {
  let i = 0;
  let spawn = StructureFinder.getSpawnByName(spawnNames[i]);
  while (spawn && spawn.spawning !== null) {
    spawn = StructureFinder.getSpawnByName(spawnNames[++i]);
  }
  return spawn;
};

/**
 * Recruit a creep to given role with desired model design
 * @param  model - CreepModel
 * @param  role - Role
 * @param  roomName - MyRoomName
 * @param  creepName - string
 * @param  srcIndex - number
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitCreep({ roomName, role, model, creepName, srcIndex }: RecruitStrategy): boolean {
  const { spawnNames, debugMode } = RoomAPI.getRoomConfig(roomName).spawn;
  creepName = generateCreepName(model, creepName);
  if (srcIndex === undefined) srcIndex = 0;

  if (debugMode && Memory.debugCountdown > 0) {
    console.log(`TEST Spawning new ${role}: ${creepName}`);
    return true;
  }

  const spawn = getIdleSpawn(spawnNames);
  if (!spawn) {
    return false;
  }

  const result = spawn.spawnCreep(CreepModelAnalyzer.buildBodyParts(model), creepName, {
    memory: { role, roomName, srcIndex }
  });
  printCreepSpawningMsg(spawn, creepName, role, CreepModelAnalyzer.calcModelCost(model));
  return result === 0;
}

/**
 * Recruit a creep from a list of given models (in descending recruit cost order)
 * @param  Room
 * @param  role
 * @param  models
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitFromModels(room: Room, role: Role, models: CreepModel[]): boolean {
  const createStrat = (model: CreepModel): RecruitStrategy => {
    return { model, role, roomName: room.name as MyRoomName };
  };

  const isEnoughEnergy = (model: CreepModel): boolean => {
    return getEnergyAvailable(room) >= CreepModelAnalyzer.calcModelCost(model);
  };

  if (models.length === 0) {
    return false;
  }

  let i = 0;
  let nextModel = models[i];
  while (i < models.length && !isEnoughEnergy(nextModel)) {
    nextModel = models[i++];
  }

  return recruitCreep(createStrat(nextModel));
}

/**
 * Determine if it's okay to recruit in advance
 * @param  currentTeam current team of same role
 * @param  maxTeamSize max allowed team size
 * @param  newCreepReadyTime time for new creep to get ready to work
 * @returns  true if all in-advance recruit requirements met, false otherwise
 */
function recruitInAdvanceOk(currentTeam: Creep[], maxTeamSize: number, newCreepReadyTime: number): boolean {
  if (maxTeamSize === 0) {
    return false;
  }

  if (currentTeam.length === 0 || currentTeam.length < maxTeamSize) {
    return true;
  }

  const oldestCreep = currentTeam
    .filter((c: Creep) => c.ticksToLive !== undefined)
    .sort((a, b) => {
      // NOTE: possible refactor
      // const aLife = a.ticksToLive || Infinity;
      const aLife = a.ticksToLive !== undefined ? a.ticksToLive : Infinity;
      const bLife = b.ticksToLive !== undefined ? b.ticksToLive : Infinity;
      return aLife - bLife;
    })[0];

  return (
    currentTeam.length === maxTeamSize &&
    oldestCreep.ticksToLive !== undefined &&
    oldestCreep.ticksToLive < newCreepReadyTime
  );
}

/**
 * Determine if the room should recruit harvesters
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit harvesters, false otherwise
 */
function shouldRecruitHarvesters(room: Room, roomConfig: RoomConfig): boolean {
  const { currentModel, teamSize } = roomConfig.harvester;
  return recruitInAdvanceOk(
    Squad.getTeam(BEE, room.name as MyRoomName),
    teamSize,
    CreepModelAnalyzer.getCreepSpawningTime(currentModel)
  );
}

/**
 * Recruit harvesters in specified room
 * @param  room
 * @param  currentModel
 */
function recruitHarvesters(room: Room, currentModel: CreepModel) {
  return recruitFromModels(room, BEE, [currentModel, MODELS.CARRIER_6, MODELS.CARRIER_3, MODELS.CARRIER_1]);
}

/**
 * Determine if the room should recruit builders
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit builders, false otherwise
 */
function shouldRecruitBuilders(room: Room, roomConfig: RoomConfig): boolean {
  const { currentModel, teamSize } = roomConfig.builder;
  const constructionsInRoom = room.find(FIND_CONSTRUCTION_SITES);
  return (
    constructionsInRoom.length > 0 &&
    recruitInAdvanceOk(
      Squad.getTeam("builder", room.name as MyRoomName),
      teamSize,
      CreepModelAnalyzer.getCreepSpawningTime(currentModel)
    )
  );
}

/**
 * Recruit builders in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitBuilders(room: Room, currentModel: CreepModel): boolean {
  return recruitFromModels(room, BEAVER, [currentModel, MODELS.WORKER_1B]);
}

/**
 * Determine if the room should recruit upgraders
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit upgraders, false otherwise
 */
function shouldRecruitUpgraders(room: Room, roomConfig: RoomConfig): boolean {
  const { currentModel, teamSize, distanceToSource } = roomConfig.upgrader;
  const controller = StructureFinder.getController(room);
  const model = controller !== undefined && controller.level === 8 ? MODELS.WORKER_3 : currentModel;
  const upgraderTeam = Squad.getTeam(RESEARCHER, room.name as MyRoomName);

  return (
    controller !== undefined &&
    ((controller.level === 8 && upgraderTeam.length === 0 && controller.ticksToDowngrade < 160000) ||
      controller.level < 8) &&
    recruitInAdvanceOk(upgraderTeam, teamSize, CreepModelAnalyzer.getCreepSpawningTime(model) + distanceToSource)
  );
}

/**
 * Recruit upgraders in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitUpgraders(room: Room, currentModel: CreepModel): boolean {
  const controller = StructureFinder.getController(room);
  const model = controller !== undefined && controller.level === 8 ? MODELS.WORKER_3 : currentModel;
  return recruitFromModels(room, RESEARCHER, [model]);
}

/**
 * Determine if the room should recruit repairers
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit repairers, false otherwise
 */
function shouldRecruitRepairers(room: Room, roomConfig: RoomConfig): boolean {
  const { teamSize, spawnCycle } = roomConfig.repairer;
  return Squad.getTeam(ENGINEER, room.name as MyRoomName).length < teamSize && Game.time % spawnCycle === 0;
}

/**
 * Recruit repairers in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitRepairers(room: Room, currentModel: CreepModel): boolean {
  return recruitFromModels(room, ENGINEER, [currentModel]);
}

/**
 * Determine if the room should recruit miners
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit miners, false otherwise
 */
function shouldRecruitMiners(room: Room, roomConfig: RoomConfig): boolean {
  const { currentModel, teamSize, distanceToSource } = roomConfig.miner;
  return recruitInAdvanceOk(
    Squad.getTeam(DIGGER, room.name as MyRoomName),
    teamSize,
    CreepModelAnalyzer.getCreepSpawningTime(currentModel) + distanceToSource
  );
}

/**
 * Recruit miners in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitMiners(room: Room, currentModel: CreepModel): boolean {
  return recruitFromModels(room, DIGGER, [
    currentModel,
    MODELS.WORKER_5B,
    MODELS.WORKER_3,
    MODELS.WORKER_2B,
    MODELS.WORKER_1B
  ]);
}

function shouldRecruitTransferrer(room: Room, roomConfig: RoomConfig) {
  const { currentModel, teamSize } = roomConfig.transferrer;
  return recruitInAdvanceOk(
    Squad.getTeam(HAULER),
    teamSize,
    CreepModelAnalyzer.getCreepSpawningTime(currentModel)
  );
}

/**
 * Recruit transferrers in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitTransferrers(room: Room, currentModel: CreepModel): boolean {
  return recruitFromModels(room, HAULER, [currentModel]);
}

/**
 * Determine if the room should recruit extractors
 * @param  room
 * @param  roomConfig
 * @returns  true if room should recruit extractors, false otherwise
 */
function shouldRecruitExtractors(room: Room, roomConfig: RoomConfig): boolean {
  const { currentModel, teamSize, distanceToSource } = roomConfig.extractor;
  const mineral = room.find(FIND_MINERALS)[0];

  return (
    mineral.mineralAmount > 0 &&
    StructureFinder.getExtractor(room) !== undefined &&
    recruitInAdvanceOk(
      Squad.getTeam(CHEMIST, room.name as MyRoomName),
      teamSize,
      CreepModelAnalyzer.getCreepSpawningTime(currentModel) + distanceToSource
    )
  );
}

/**
 * Recruit extractors in the specified room
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitExtractors(room: Room, currentModel: CreepModel): boolean {
  return recruitFromModels(room, CHEMIST, [currentModel]);
}

/**
 * Determine if the room should recruit army
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit army, false otherwise
 */
function shouldRecruitArmy(room: Room, roomConfig: RoomConfig): boolean {
  const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
  return hostileCreeps.length > 1 && Squad.getTeam(SEAL, room.name as MyRoomName).length === 0;
}

/**
 * recruit army when two or more hostile creeps show up
 * @param  room
 * @param  currentModel
 * @returns  true if the recruit is successful, false otherwise
 */
function recruitArmy(room: Room, currentModel: CreepModel): boolean {
  if (!currentModel) {
    currentModel = MODELS.DEFENDER2;
  }
  return recruitFromModels(room, SEAL, [currentModel]);
}

/**
 * Recruit creeps for a room based on its config parameters
 * @param  roomName
 */
function recruitForRoom(roomName: string): boolean {
  const room = Game.rooms[roomName];
  const roomConfig = RoomAPI.getRoomConfig(roomName as MyRoomName);

  if (room && roomConfig) {
    if (shouldRecruitArmy(room, roomConfig)) {
      return recruitArmy(room, MODELS.DEFENDER2);
    }

    if (shouldRecruitMiners(room, roomConfig)) {
      return recruitMiners(room, roomConfig.miner.currentModel);
    }

    if (shouldRecruitUpgraders(room, roomConfig)) {
      return recruitUpgraders(room, roomConfig.upgrader.currentModel);
    }

    if (shouldRecruitHarvesters(room, roomConfig)) {
      return recruitHarvesters(room, roomConfig.harvester.currentModel);
    }

    if (shouldRecruitRepairers(room, roomConfig)) {
      return recruitRepairers(room, roomConfig.repairer.currentModel);
    }

    if (shouldRecruitExtractors(room, roomConfig)) {
      return recruitExtractors(room, roomConfig.extractor.currentModel);
    }

    if (shouldRecruitBuilders(room, roomConfig)) {
      return recruitBuilders(room, roomConfig.builder.currentModel);
    }

    if (shouldRecruitTransferrer(room, roomConfig)) {
      return recruitTransferrers(room, roomConfig.transferrer.currentModel);
    }
  }
  return false;
}

const run = () => {
  RoomAPI.getMyRooms().forEach((roomName: string) => {
    const { debugMode, spawnNames, spawningDirections } = RoomAPI.getRoomConfig(roomName as MyRoomName).spawn;
    if (debugMode && Memory.debugCountdown > 0) {
      console.log(`Room ${roomName} spawning debug mode is on`);
    }
    recruitForRoom(roomName);
    const spawn = StructureFinder.getSpawnByName(spawnNames[0]);
    if (spawn && spawn.spawning) {
      spawn.spawning.setDirections(spawningDirections);
    }
  });
};

export { run, recruitCreep };
