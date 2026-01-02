import { CreepModel } from "./interfaces";

export default class CreepModelAnalyzer {
  /**
   * Get the unit cost of the given type of body part
   * @param bodyPart the specified body type
   *
   * @returns the unit cost
   */
  private static getUnitPartCost(bodyPart: BodyPartConstant): number {
    // TODO: refactor using BODYPART_COST
    // let cost = BODYPART_COST[WORK];
    // return BODYPART_COST[creepBody];
    switch (bodyPart) {
      case WORK:
        return 100;
      case ATTACK:
        return 80;
      case RANGED_ATTACK:
        return 150;
      case HEAL:
        return 250;
      case CLAIM:
        return 600;
      case TOUGH:
        return 10;
      default:
        return 50;
    }
  }

  /**
   * Get the cost of the given creep model
   * @param CreepModel creepModel
   * @returns {number} cost of creep model
   */
  public static calcModelCost(creepModel: CreepModel): number {
    return Object.entries(creepModel.body).reduce((total, [key, value]) => {
      const body = key as BodyPartConstant;
      return total + (value ?? 0) * this.getUnitPartCost(body);
    }, 0);
  }

  /**
   * Find total spawning time of a model
   * @param CreepModel creepModel
   * @returns {number} spawning time of a given model
   */
  public static getCreepSpawningTime(creepModel: CreepModel): number {
    const timePerPart = 3;
    let numParts = 0;
    for (const value of Object.values(creepModel.body)) {
      if (value !== undefined) numParts += value;
    }
    return timePerPart * numParts;
  }

  /**
   * Get the body parts of the given creep model
   * @param CreepModel creepModel
   * @returns {string[]} an array of body parts
   */
  public static buildBodyParts(creepModel: CreepModel): BodyPartConstant[] {
    let parts: BodyPartConstant[] = [];
    for (const key in creepModel.body) {
      const part = key as BodyPartConstant;
      const numOfParts = creepModel.body[part];
      parts = parts.concat(Array(numOfParts).fill(part));
    }
    return parts;
  }
}
