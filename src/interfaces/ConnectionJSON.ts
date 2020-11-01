/**
 * An interface for representing a connection with an json object
 */

export interface ConnectionJSON {
  readonly id: number;
  /**
   * The connection weight
   */
  readonly weight: number;
  /**
   * The index of the origin node
   */
  readonly fromIndex: number;
  /**
   * The index of the destination node
   */
  readonly toIndex: number;
  /**
   * The index of the gate node, if connection is gated
   */
  readonly gateNodeIndex: number | null;
  /**
   * The xTrace values
   */
  readonly xTraces: Map<number, number> | null;
}
