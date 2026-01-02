import { Upgrader } from "./role";
import { Role } from "./role/interfaces";
import RoleManager from "./role/RoleManager";
import RoleManagerFactory from "./role/RoleManagerFactory";

export default class JobManager {
  /**
   * Assign jos to creeps based on their roles
   */
  public static assignJobs() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const roleManagerFactory: RoleManagerFactory = new RoleManagerFactory();
      const manager: RoleManager = roleManagerFactory.generateRoleManager(creep.memory.role as Role);
      console.log(manager instanceof Upgrader, "manager");
      manager.run(creep);
    }
  }
}
