import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/player";
import JobPromise from "utils/runjob";

export const CopyCommand: CustomCommand = {
    name: "redtools:copy",
    description: "Copies selection to clipboard",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
}

export function copyCommandExecute(origin: CustomCommandOrigin) {
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
    new JobPromise(data.copySelection(origin.sourceEntity.location), (progress) => {})
    data.previewClipboard = true;
    return {
        message: "Successfully copied selection",
        status: CustomCommandStatus.Success
    }
}