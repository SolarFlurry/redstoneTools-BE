import { Vector3Utils } from "@minecraft/math";
import { Vector3, Dimension, BlockPermutation, Block } from "@minecraft/server";
import { iterateOverRange } from "utils/range";
import JobPromise from "utils/runjob";

export class PlayerSelection {
	constructor (dimension: Dimension) {
		this.region = new Map<Vector3, BlockPermutation>();
		this.dimension = dimension;
		this.points = [];
	}

	public readonly points: Vector3[];
	public readonly region: Map<Vector3, BlockPermutation>;
	public readonly dimension: Dimension;

	/**
	 * Gets the region the selection is occupying
	 * @param getRegionOptions - Options for getRegion method
	 */
	public *getRegion (getRegionOptions?: {includeAir?: boolean}): Generator<void, void, void> {
		yield* iterateOverRange(this.points[0], this.points[1], (pos: Vector3, getRegionOptions) => {
			const block = this.dimension.getBlock(pos)
			if ((!(getRegionOptions.includeAir && block.isAir)) && block) {
				this.region.set(Vector3Utils.subtract(pos, this.points[0]), block.permutation)
			}
		}, getRegionOptions)
	}

	/**
	 * 
	 * @param setPos The position to move the selection to
	 */
	public *setRegion (setPos: Vector3) {
		for (const [key, value] of this.region) {
			if (value) {
				this.dimension.setBlockPermutation(Vector3Utils.add(key, setPos), value)
			}
			yield;
		}
	}
}