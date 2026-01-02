import { CreepModel } from "creep/interfaces";
import { Role } from "./role/interfaces";

export type RecruitStrategy = {
  roomName: MyRoomName;
  role: Role;
  model: CreepModel;
  creepName?: string;
  srcIndex?: number;
};
