import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandStatus, Player, system } from "@minecraft/server";
import { ModalFormData } from '@minecraft/server-ui'
import { playerData } from "core/player";

export const SettingsCommand: CustomCommand = {
    name: "redtools:settings",
    description: "Adjust settings for the Redstone Tools Addon",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true
}

export function settingsCommandExecute(origin: CustomCommandOrigin) {
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
        const form = new ModalFormData()
            .title("redtools:settings")
            .label("Selection")
            .toggle("Outline", {defaultValue: data.settings.outline})
            .toggle("Highlight", {defaultValue: data.settings.highlight})
            .divider()
            .label("Toggles")
            .toggle("Redstone Indicator", {defaultValue: data.settings.redstoneIndicator})
            .toggle("Auto Dust", {defaultValue: data.settings.autoDust})
            .toggle("Auto Top Half Slab", {defaultValue: data.settings.topHalfSlab})
            .submitButton("Apply")
        form.show(<Player>origin.sourceEntity).then((r) => {
            if (r.canceled) return;

            let [, outline, highlight,,, redstoneIndicator, autodust, topHalfSlab] = r.formValues

            data.settings.highlight = <boolean>highlight
            data.settings.outline = <boolean>outline
            data.settings.redstoneIndicator = <boolean>redstoneIndicator
            data.settings.autoDust = <boolean>autodust
            data.settings.topHalfSlab = <boolean>topHalfSlab
        })
    })
}