import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/player";

export const PreviewCommand: CustomCommand = {
    name: "redtools:preview",
    description: "preview where the clipboard will be pasted",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
}

export function previewCommandExecute(origin: CustomCommandOrigin) {
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

    data.previewClipboard = !data.previewClipboard
}