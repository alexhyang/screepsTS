import JobManager from "squad/JobManager";
import * as Recruiter from "squad/Recruiter";

export function run() {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  Recruiter.run();
  JobManager.assignJobs();
  console.log("\n");
}

