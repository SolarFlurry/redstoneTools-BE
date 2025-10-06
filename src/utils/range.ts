import { Vector3Utils } from "@minecraft/math";
import { Vector3 } from "@minecraft/server";

export function getRange(pos1: Vector3, pos2: Vector3): [Vector3, Vector3] {
	const start = Vector3Utils.clamp(pos1, {max: pos2});
	const end = Vector3Utils.clamp(pos1, {min: pos2});

	return [start, end];
}

export function *iterateOverRange(pos1: Vector3, pos2: Vector3, iterator: Function, ...args: any[]): Generator<void, void, void> {
	const [start, end] = getRange(pos1, pos2);

	for (let x = 0; x < pos2.x - pos1.x; x++) {
		for (let y = 0; y < pos2.y - pos1.y; y++) {
			for (let z = 0; z < pos2.z - pos1.z; z++) {
				const block = this.dimension.getBlock(Vector3Utils.add(pos1, {x, y, z}))
				iterator({x, y, z}, args);
				yield;
			}
		}
	}
}