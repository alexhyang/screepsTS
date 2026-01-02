import { Builder, Extractor, Harvester, Miner, Repairer, Transferrer, Upgrader } from ".";
import * as roles from "./interfaces";
import { Role } from "./interfaces"
import RoleManager from "./RoleManager";

export default class RoleManagerFactory {
  public generateRoleManager(role: Role): RoleManager {
    switch (role) {
      case roles.RESEARCHER:
        return new Upgrader();
      case roles.BEAVER:
        return new Builder();
      case roles.ENGINEER:
        return new Repairer();
      case roles.DIGGER:
        return new Miner();
      case roles.CHEMIST:
        return new Extractor();
      case roles.HAULER:
        return new Transferrer();
      default:
        return new Harvester();
    }
  }
}
