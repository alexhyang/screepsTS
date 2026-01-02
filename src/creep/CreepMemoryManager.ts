import { CreepMemoryAPI } from "utils/MemoryAPI";
import { storeHasResource } from "utils/ResourceManager";

/**
 * Initialize the types of resources carried by the given creep to empty array
 * @param  creep
 */
const initCarriedResourceTypes = (creep: Creep): void => {
  if (!creep) return;
  CreepMemoryAPI.setMem(creep, "resourceTypes", []);
};

/**
 * Get the types of resources carried by the given creep
 * @param  creep
 * @returns  a list of ResourceConstant if the creep is carrying resources, undefined otherwise
 */
const getCarriedResourceTypes = (creep: Creep): ResourceConstant[] | undefined => {
  if (!creep) return undefined;
  return CreepMemoryAPI.getMem(creep, "resourceTypes");
};

/**
 * Set the types of resources carried by the given creep
 * @param  creep
 */
const setCarriedResourceTypes = (creep: Creep, resourceTypes: ResourceConstant[]): void => {
  if (!creep) return;
  CreepMemoryAPI.setMem(creep, "resourceTypes", resourceTypes);
};

/**
 * Add a new type of resource carried by the given creep, do nothing when specified resource is energy
 * @param  creep
 */
const addCarriedResourceTypes = (creep: Creep, resourceType: ResourceConstant): void => {
  if (!creep) return;
  if (resourceType === RESOURCE_ENERGY) return;

  const carried = getCarriedResourceTypes(creep);

  if (carried === undefined) {
    initCarriedResourceTypes(creep);
    setCarriedResourceTypes(creep, [resourceType]);
    return;
  }

  if (carried.includes(resourceType)) {
    return;
  }

  setCarriedResourceTypes(creep, [...carried, resourceType]);
};

/**
 * Synchronize creep resource memory by its current carried resource types
 * @param  creep
 */
const syncCarriedResourceTypes = (creep: Creep): void => {
  if (!creep) return;

  const resourceTypes = getCarriedResourceTypes(creep);
  if (resourceTypes === undefined) {
    initCarriedResourceTypes(creep);
    return;
  }

  const updated = resourceTypes.filter(r => !storeHasResource(creep, r));
  setCarriedResourceTypes(creep, updated);
};

export {
  initCarriedResourceTypes,
  getCarriedResourceTypes,
  setCarriedResourceTypes,
  addCarriedResourceTypes,
  syncCarriedResourceTypes
};
