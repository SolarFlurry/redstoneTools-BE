import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandStatus, Player, system } from "@minecraft/server";
import { ActionFormData } from '@minecraft/server-ui'
import { playerData } from "core/player";

export const LibraryCommand: CustomCommand = {
    name: "redtools:library",
    description: "Open the Circuit Library",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true
}

export function libraryCommandExecute(origin: CustomCommandOrigin) {
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

    system.run(() => {
        const form = new ActionFormData()
            .title("redtools:circuit_library")
            .button("3x5 Char Display", "textures/redtools/circuits/3x5_char_display")
            .button("16-Tall glass tower", "textures/redtools/circuits/16_tall_glass_tower")
            .button("Monostable Circuit", "textures/redtools/circuits/monostable_circuit")
            .button("2x2 Pixel Module", "textures/redtools/circuits/2x2_pixel_module")
        form.show(<Player>origin.sourceEntity).then((r) => {
            if (r.canceled) return;
        })
    })
}