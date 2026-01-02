import RoomAPI from "./RoomAPI";
import { RoomMineral } from "utils/interfaces";

/**
 * Get room mineral type
 * @param  roomName
 * @returns  type of mineral in room
 */
function getRoomMineralType(roomName: any): MineralConstant {
  const mineral = RoomAPI.getRoom(roomName).find(FIND_MINERALS)[0];
  return mineral.mineralType;
}

/**
 * Get room mineral commodity type
 * @param  mineralType
 * @returns  type of mineral commodity in room
 */
function getRoomCommodityType(roomName: any): CommodityConstant {
  const mapping = {
    [RESOURCE_UTRIUM]: RESOURCE_UTRIUM_BAR,
    [RESOURCE_LEMERGIUM]: RESOURCE_LEMERGIUM_BAR,
    [RESOURCE_KEANIUM]: RESOURCE_KEANIUM_BAR,
    [RESOURCE_ZYNTHIUM]: RESOURCE_ZYNTHIUM_BAR,
    [RESOURCE_OXYGEN]: RESOURCE_OXIDANT,
    [RESOURCE_HYDROGEN]: RESOURCE_REDUCTANT
  };

  const mineralType = getRoomMineralType(roomName);
  return mapping[mineralType as RoomMineral];
}

export { getRoomMineralType, getRoomCommodityType };
