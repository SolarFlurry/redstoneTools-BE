import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/player";
import { Color, isGlass, isWool, setGlass, setWool } from "utils/color";
import JobPromise from "utils/runjob";
import { Vector3Utils } from "utils/vector3";

export const ColorcodeCommand: CustomCommand = {
	name: "redtools:colorcode",
	description: "Converts all colored blocks in selection to a specified color",
	permissionLevel: CommandPermissionLevel.Any,
	cheatsRequired: true,
	mandatoryParameters: [
		{
			name: "redtools:color",
			type: CustomCommandParamType.Enum
		}
	]
}

export function colorcodeCommandExecute(origin: CustomCommandOrigin, color: Color) {
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

	new JobPromise(data.selection.iterateOverRange((pos, start) => {
		const block = data.selection.dimension.getBlock(Vector3Utils.add(pos, start));
		if (isGlass(block.typeId)) {
			setGlass(block, color);
		} else if (isWool(block.typeId)) {
			setWool(block, color);
		}
	}), (progress) => {})
}