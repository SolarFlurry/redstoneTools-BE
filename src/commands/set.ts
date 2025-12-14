import { BlockType, CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/player";
import JobPromise from "utils/runjob";
import { Vector3Utils } from "utils/vector3";

export const SetCommand: CustomCommand = {
    name: "redtools:set",
    description: "Sets every block in the selection",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
    mandatoryParameters: [
        {
            name: "tileName",
            type: CustomCommandParamType.BlockType
        }
    ]
}

export function setCommandExecute(origin: CustomCommandOrigin, tileName: BlockType) {
    if (!origin.sourceEntity) return {
            message: "Command must be run by a player",
            status: CustomCommandStatus.Failure
    }
    if (origin.sourceEntity.typeId !== "minecraft:player") return {
            message: "Command must be run by a player",
            status: CustomCommandStatus.Failure
    }
    const data = playerData.get(origin.sourceEntity.id)
    if (!data) return {
		message: `Player ${origin.sourceEntity.nameTag} does not have permission`,
		status: CustomCommandStatus.Failure
	}
    new JobPromise(data.selection.iterateOverRange((pos, start) => {
        console.log(`set: ${Vector3Utils.toString(pos)}`);
        data.selection.dimension.setBlockType(Vector3Utils.add(pos, start), tileName);
    }), (progress) => {})
}