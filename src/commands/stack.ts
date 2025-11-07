import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, system, Vector3 } from '@minecraft/server'
import { PlayerSelection } from 'core/selection'
import { playerData } from 'core/player'
import { getDirection } from 'utils/direction'
import JobPromise from 'utils/runjob'
import { Vector3Utils } from 'utils/vector3'

export const StackCommand: CustomCommand = {
	name: "redtools:stack",
	description: "Stacks selection",
	permissionLevel: CommandPermissionLevel.Any,
	cheatsRequired: true,
	mandatoryParameters: [
		{
			name: "stackAmount",
			type: CustomCommandParamType.Integer
		},
		{
			name: "redtools:direction",
			type: CustomCommandParamType.Enum
		}
	],
	optionalParameters: [
		{
			name: "stackOffset",
			type: CustomCommandParamType.Integer
		}
	]
}

function syncStack(data: PlayerSelection, dirVector: Vector3, stackOffset: number, n: number) {
	if (n > 0) {
		new JobPromise(data.setRegion(Vector3Utils.add(data.points[0], Vector3Utils.scale(dirVector, stackOffset*n))), (progress) => {}).then(() => {
			syncStack(data, dirVector, stackOffset, n-1);
		})
	}
}

export function stackCommandExecute(origin: CustomCommandOrigin, stackAmount: number, direction: string, stackOffset: number): CustomCommandResult {
	if (!origin.sourceEntity) return {
		message: "Command must be run by a player",
		status: CustomCommandStatus.Failure
	}
	if (origin.sourceEntity.typeId !== "minecraft:player") return {
		message: "Command must be run by a player",
		status: CustomCommandStatus.Failure
	}

	const data = playerData.get(origin.sourceEntity.id);
	if (!data) return {
		message: `Player ${origin.sourceEntity.nameTag} does not have permission`,
		status: CustomCommandStatus.Failure
	}

	console.log(`/stack command run by ${origin.sourceEntity.nameTag}`)
	let dirVector = getDirection(origin.sourceEntity)
	console.log(Vector3Utils.toString(dirVector))
	switch (direction) {
		case "f": case "front":
			dirVector = {x: dirVector.x, y: dirVector.y, z: dirVector.z}
			break;
		case "b": case "back":
			dirVector = {x: -dirVector.x, y: dirVector.y, z: -dirVector.z}
			break;
		case "r": case "right":
			dirVector = {x: -dirVector.z, y: dirVector.y, z: dirVector.x}
			break;
		case "l": case "left":
			dirVector = {x: dirVector.z, y: dirVector.y, z: -dirVector.x}
			break;
		case "u": case "up":
			dirVector = {x: 0, y: 1, z: 0}
			break;
		case "d": case "down":
			dirVector = {x: 0, y: -1, z: 0}
			break;
	}
	let amount: number;
	if (Vector3Utils.equals(dirVector, {x: 1, y: 0, z: 0}) || Vector3Utils.equals(dirVector, {x: -1, y: 0, z: 0})) {
		amount = data.selection.bounds().x;
	} else if (Vector3Utils.equals(dirVector, {x: 0, y: 1, z: 0}) || Vector3Utils.equals(dirVector, {x: 0, y: -1, z: 0})) {
		amount = data.selection.bounds().y;
	} else if (Vector3Utils.equals(dirVector, {x: 0, y: 0, z: 1}) || Vector3Utils.equals(dirVector, {x: 0, y: 0, z: -1})) {
		amount = data.selection.bounds().z;
	} else {
		amount = data.selection.bounds().y
	}
	new JobPromise(data.selection.getRegion({includeAir: false}), (progress) => {}).then(() => {
		if (stackOffset) {
			syncStack(data.selection, dirVector, stackOffset, stackAmount);
		} else {
			for (let i = 0; i < stackAmount; i++) {
				new JobPromise(
					data.selection.setRegion(Vector3Utils.add(data.selection.points[0], Vector3Utils.scale(dirVector, amount*(i+1)))),
					(progress) => {}
				)
			}
		}
	})

	return {
		message: "Successfully stacked blocks",
		status: CustomCommandStatus.Success
	}
}