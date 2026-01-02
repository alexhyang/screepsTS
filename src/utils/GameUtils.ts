export default class GameUtils {
  /**
   * Get Room Object by id
   * @param  id
   * @returns  room object with the given id, or null if not found
   */
  public static getById<T extends _HasId>(id: Id<T>): T | null {
    return Game.getObjectById<T>(id);
  }
}
