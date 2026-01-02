type Role =
  | UPGRADER
  | HARVESTER
  | BUILDER
  | REPAIRER
  | MINER
  | EXTRACTOR
  | TRANSFERRER
  | ARMY;

// declare const RESEARCHER: UPGRADER;
// declare const BEE: HARVESTER;
// declare const BEAVER: BUILDER;
// declare const ENGINEER: REPAIRER;
// declare const DIGGER: MINER;
// declare const CHEMIST: EXTRACTOR;
// declare const HAULER: TRANSFERRER;
// declare const SEAL: ARMY;

const RESEARCHER: UPGRADER = "upgrader";
const BEE: HARVESTER = "harvester";
const BEAVER: BUILDER = "builder";
const ENGINEER: REPAIRER = "repairer";
const DIGGER: MINER = "miner";
const CHEMIST: EXTRACTOR = "extractor";
const HAULER: TRANSFERRER = "transferrer";
const SEAL: ARMY = "army";

type UPGRADER = "upgrader"
type HARVESTER = "harvester"
type BUILDER = "builder"
type REPAIRER = "repairer"
type MINER = "miner"
type EXTRACTOR = "extractor"
type TRANSFERRER = "transferrer"
type ARMY = "army"

export {
  Role,
  RESEARCHER,
  BEE,
  BEAVER,
  ENGINEER,
  DIGGER,
  CHEMIST,
  HAULER,
  SEAL,
}
