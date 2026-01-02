import MODELS from "creep/CreepModels";
import { RoomConfig } from "./interfaces";

const DEBUG_MODE = false;
const W4N12_LEFT_SOURCE = 0;
const W4N12_RIGHT_SOURCE = 1;

const config: RoomConfig = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 500,
  STORAGE_WITHDRAW_THRESHOLD: 10000,
  spawn: {
    spawnNames: ["04120"],
    debugMode: DEBUG_MODE,
    spawningDirections: [TOP_LEFT, LEFT, BOTTOM_LEFT, BOTTOM]
  },
  tower: {
    minTowerEnergyToRepair: 500,
    maxFiringRange: 30
  },
  harvester: {
    currentModel: MODELS.CARRIER_10,
    teamSize: 1,
    sourceIndex: W4N12_RIGHT_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "storage",
      "source"
    ]
  },
  miner: {
    distanceToSource: 5, // distance to source = 5
    currentModel: MODELS.WORKER_6A, // 6A is the most efficient miner model
    teamSize: 0,
    sourceIndex: W4N12_RIGHT_SOURCE,
    sourceOrigins: ["source"]
  },
  extractor: {
    distanceToSource: 20,
    currentModel: MODELS.WORKER_5B,
    teamSize: 0
  },
  upgrader: {
    distanceToSource: 25, // distance to source = 5
    currentModel: MODELS.WORKER_6B,
    teamSize: 0,
    sourceIndex: W4N12_LEFT_SOURCE,
    sourceOrigins: [
      // "storage",
      // "container",
      "link",
      "source"
    ]
  },
  builder: {
    currentModel: MODELS.WORKER_5C, // 2B(212), 4B(413), 5C(534)
    teamSize: 0,
    sourceIndex: W4N12_RIGHT_SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "storage",
      "container",
      // "extension",
      // "spawn",
      "source"
    ],
    buildingPriority: "none"
  },
  repairer: {
    spawnCycle: 1, // set to 1 for spawn with no delay
    currentModel: MODELS.WORKER_5C,
    teamSize: 0,
    sourceIndex: W4N12_RIGHT_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      // "tombstone",
      "ruin",
      "container",
      "storage"
      // "extension",
      // "spawn",
      // "wall",
      // "source",
    ],
    repairingPriority: "infrastructure",
    repairingHitsRatio: 0.8
  },
  transferrer: {
    currentModel: MODELS.CARRIER_10,
    teamSize: 0
  },
  army: {
    currentModel: MODELS.DEFENDER2,
    teamSize: 0
  }
};

export default config;
