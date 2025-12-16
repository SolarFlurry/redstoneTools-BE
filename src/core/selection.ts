import { DebugBox, debugDrawer } from "@minecraft/debug-utilities";
import { Vector3Utils } from "utils/vector3";
import { Vector3, Dimension, BlockPermutation } from "@minecraft/server";
import { getRange, iterateOverRange } from "utils/range";
import JobPromise from "utils/runjob";
import { RegionBlock } from "./region";
import { playerData, PlayerData } from "./player";

export class PlayerSelection {
	constructor (dimension: Dimension) {
		this.region = new Map<Vector3, RegionBlock>();
		this.dimension = dimension;
		this.points = [{x:0,y:0,z:0},{x:0,y:0,z:0}];
		this.outline = new DebugBox({x: 0, y: 0, z: 0});
		debugDrawer.addShape(this.outline)
	}

	public readonly points: [Vector3, Vector3];
	public readonly region: Map<Vector3, RegionBlock>;
	public readonly dimension: Dimension;
	private outline: DebugBox;

	public bounds(): Vector3 {
		const [lower, upper] = getRange(this.points[0], this.points[1]);
		return Vector3Utils.add(Vector3Utils.subtract(upper, lower), {x: 1, y: 1, z: 1});
	}

	public setPos1(pos: Vector3) {
		this.points[0] = pos
	}
	public setPos2(pos: Vector3) {
		this.points[1] = pos
	}

	public updateSelection() {
		let [lower, upper] = getRange(this.points[0], this.points[1]);
		upper = Vector3Utils.add(upper, {x: 1.01, y: 1.01, z: 1.01})
		lower = Vector3Utils.subtract(lower, {x: 0.01, y: 0.01, z: 0.01})
		this.outline.setLocation(lower)
		this.outline.bound = Vector3Utils.subtract(upper, lower);
	}

	public removeSelection() {
		debugDrawer.removeShape(this.outline)
	}

	public *iterateOverRange(iterator: (arg0: Vector3, arg1: Vector3, ...args: any[]) => void, ...args: any[]) {
		yield* iterateOverRange(this.points[0], this.points[1], this.dimension, iterator, args)
	}

	/**
	 * Gets the region the selection is occupying
	 * @param getRegionOptions - Options for getRegion method
	 */
	public *getRegion (getRegionOptions?: {includeAir?: boolean}) {
		this.region.clear()
		yield* this.iterateOverRange((pos: Vector3, start: Vector3, getRegionOptions) => {
			// get the block
			const block = this.dimension.getBlock(Vector3Utils.add(pos, start))
			if (!(block.isAir && !getRegionOptions.includeAir) && block) {
				console.log(`get - ${Vector3Utils.toString(pos)}: ${block.typeId}`)
				console.log(`get - air:${block.isAir}, include:${getRegionOptions.includeAir}`)
				let permutation = block.permutation;
				if (permutation.type.id === "minecraft:powered_comparator") {
					permutation = BlockPermutation.resolve("minecraft:unpowered_comparator", permutation.getAllStates())
				} else if (permutation.type.id === "minecraft:powered_repeater") {
					permutation = BlockPermutation.resolve("minecraft:unpowered_repeater", permutation.getAllStates())
				}
				// set the block in the selection
				this.region.set(pos, RegionBlock.fromBlock(block))
			}
		}, getRegionOptions)
	}

	/**
	 * 
	 * @param setPos The position to move the selection to
	 */
	public *setRegion (setPos: Vector3) {
		const [lower, upper] = getRange(this.points[0], this.points[1])
		const translate = Vector3Utils.add(Vector3Utils.subtract(lower, this.points[0]), setPos);
		for (const [key, value] of this.region) {
			if (value) {
				value.place(this.dimension, Vector3Utils.add(key, translate))
				console.log(`set - ${Vector3Utils.toString(key)}: ${value.block.type.id}`)
			}
			yield;
		}
	}
}