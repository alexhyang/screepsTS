/**
 * Creating an object with `Record`
 *
 * Record<K, T>          - all keys must exist (map the properties of a type to another)
 * Partial<Record<K, T>> - some keys may exist (all properties set to optional)
 * Record<string, T>     - unknown/dynamic keys
 *
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 *
 */

export interface CreepModel {
  name: string;
  body: Partial<Record<BodyPartConstant, number>>;
}

export type CreepResourceOrigin =
  | RESOURCE
  | TOMBSTONE
  | RUIN
  | STRUCTURE_LINK
  | STRUCTURE_CONTAINER
  | STRUCTURE_STORAGE
  | STRUCTURE_TERMINAL
  | SOURCE
  | STRUCTURE_WALL
  | STRUCTURE_EXTENSION
  | STRUCTURE_SPAWN;

export const RESOURCE: RESOURCE = "droppedResource";
export const TOMBSTONE: TOMBSTONE = "tombstone";
export const RUIN: RUIN = "ruin";
export const SOURCE: SOURCE = "source";

type RESOURCE = "droppedResource";
type TOMBSTONE = "tombstone";
type RUIN = "ruin";
type SOURCE = "source";
