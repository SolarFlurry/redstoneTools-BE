import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/player";
import JobPromise from "utils/runjob";

export const PasteCommand: CustomCommand = {
    name: "redtools:paste",
    description: "Pastes clipboard to current location",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
}

export function pasteCommandExecute(origin: CustomCommandOrigin) {
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
    new JobPromise(data.pasteClipboard(origin.sourceEntity.location, origin.sourceEntity.dimension), (progress) => {})
    data.previewClipboard = false
}