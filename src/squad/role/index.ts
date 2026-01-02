// Methods to change when adding new roles:
//   - roleNewRole.js (add new role module)
//   - role.js (update role index)
//   - jobManager.js (update assignJobs())
//   - dashboard.js (add role config object)
//   - recruiter.js (add recruitNewRole(), update recruitForRoom())

//   - squad.js (update getTeamMaxSize())
//   - logger.squad.js (update squadLogger())

import Harvester from "./Harvester";
import Miner from "./Miner";
import Upgrader from "./Upgrader";
import Repairer from "./Repairer";
import Builder from "./Builder";
import Transferrer from "./Transferrer";
import Extractor from "./Extractor";
import Army from "./Army";

export {
  Harvester,
  Miner,
  Upgrader,
  Repairer,
  Builder,
  Transferrer,
  Extractor,
  Army,
};
