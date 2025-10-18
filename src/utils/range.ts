import { Vector3Utils } from "utils/vector3";
import { Dimension, Vector3 } from "@minecraft/server";

export function getRange(pos1: Vector3, pos2: Vector3): [Vector3, Vector3] {
	const start = Vector3Utils.clamp(pos1, {max: pos2});
	const end = Vector3Utils.clamp(pos1, {min: pos2});

	return [start, end];
}

export function *iterateOverRange(pos1: Vector3, pos2: Vector3, dimension: Dimension, iterator: Function, ...args: any[]): Generator<void, void, void> {
	const [start, end] = getRange(pos1, pos2);

	for (let x = 0; x < end.x - start.x + 1; x++) {
		for (let y = 0; y < end.y - start.y + 1; y++) {
			for (let z = 0; z < end.z - start.z + 1; z++) {
				iterator({x, y, z}, start, args);
				yield;
			}
		}
	}
}