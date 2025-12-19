import { BlockPermutation, CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, ItemStack, system } from "@minecraft/server";

export const SignalStrengthCommand: CustomCommand = {
    name: "redtools:signalstrength",
    description: "Sets the signal strength of the barrel you are looking at",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
    mandatoryParameters: [
        {
            name: "signalStrength",
            type: CustomCommandParamType.Integer
        }
    ]
}

export function signalStrengthExecute(origin: CustomCommandOrigin, signalStrength: number): CustomCommandResult {
    if (signalStrength < 0 || signalStrength > 15) return {
        message: "Signal strength must be in the range 0-15",
        status: CustomCommandStatus.Failure
    }
    if (!origin.sourceEntity) return {
        message: "Command must be run by a player",
        status: CustomCommandStatus.Failure
    }
    if (origin.sourceEntity.typeId !== "minecraft:player") return {
		message: "Command must be run by a player",
		status: CustomCommandStatus.Failure
	}

    const raycast = origin.sourceEntity.getBlockFromViewDirection({maxDistance: 7})
    if (raycast) {
        const block = raycast.block
        system.run(() => {
            block.setType("minecraft:barrel");
            block.setPermutation(block.permutation.withState("facing_direction", 1))
            const container = block.getComponent("minecraft:inventory").container;
            if (container) {
                const itemsRequired = Math.max(signalStrength, Math.ceil((27 * 64 / 14) * (signalStrength-1)))
                console.log(itemsRequired)
                container.clearAll();
                for (let i = itemsRequired; i >= 64; i -= 64) {
                        container.addItem(new ItemStack("minecraft:redstone", 64));
                }
                if (itemsRequired % 64 > 0) container.addItem(new ItemStack("minecraft:redstone", itemsRequired % 64));
            } else console.log("no container")
        })
    } else console.log("no raycast")
}