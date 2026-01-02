export type CanHarvest = Source | Mineral | Deposit;

export type CanWithdraw = Structure | Tombstone | Ruin;

export type CanDeliver = Structure | AnyCreep;

export type HasStoreStructure =
  | StructureSpawn
  | StructureExtension
  | StructureLink
  | StructurePowerSpawn
  | StructureStorage
  | StructureTower
  | StructureLab
  | StructureTerminal
  | StructureContainer
  | StructureNuker
  | StructureFactory;

export type HasStore = Creep | PowerCreep | Ruin | HasStoreStructure | Tombstone;

export type RoomMineral =
  | RESOURCE_UTRIUM
  | RESOURCE_LEMERGIUM
  | RESOURCE_KEANIUM
  | RESOURCE_ZYNTHIUM
  | RESOURCE_OXYGEN
  | RESOURCE_HYDROGEN;

export type RoomCommodity =
  | RESOURCE_UTRIUM_BAR
  | RESOURCE_LEMERGIUM_BAR
  | RESOURCE_KEANIUM_BAR
  | RESOURCE_ZYNTHIUM_BAR
  | RESOURCE_OXIDANT
  | RESOURCE_REDUCTANT;
