import { world, system, StartupEvent, BlockVolume, MolangVariableMap } from '@minecraft/server'
import { Vector3Utils } from 'utils/vector3'
import { playerData, PlayerSelection } from 'core/selection'
import { StackCommand, stackCommandExecute } from 'commands/stack'
import { SignalStrengthCommand, signalStrengthExecute } from 'commands/signalstrength'
import { debugDrawer } from '@minecraft/debug-utilities'
import { SetCommand, setCommandExecute } from 'commands/set'
import { MoveCommand, moveCommandExecute } from 'commands/move'

system.beforeEvents.startup.subscribe((init: StartupEvent) => {
	init.customCommandRegistry.registerEnum("redtools:direction", ["r", "l", "f", "b", "u", "d", "right", "left", "front", "back", "up", "down"])
	init.customCommandRegistry.registerCommand(StackCommand, stackCommandExecute)
	init.customCommandRegistry.registerCommand(SignalStrengthCommand, signalStrengthExecute)
	init.customCommandRegistry.registerCommand(SetCommand, setCommandExecute)
	init.customCommandRegistry.registerCommand(MoveCommand, moveCommandExecute)
})

world.afterEvents.playerJoin.subscribe((event) => {
	playerData.set(event.playerId, new PlayerSelection(world.getDimension("minecraft:overworld")))
})

world.beforeEvents.playerLeave.subscribe((event) => {
	let data = playerData.get(event.player.id);
	if (!data) return;
	data.removeSelection()
	playerData.delete(event.player.id);
})

world.afterEvents.worldLoad.subscribe((event) => {
	console.log("world loaded")
	system.runInterval(() => {
		const players = world.getAllPlayers();
		for (const player of players) {
			const blocks = player.dimension.getBlocks(new BlockVolume(
				Vector3Utils.subtract(player.location, {x:5,y:5,z:5}),
				Vector3Utils.add(player.location, {x:5,y:5,z:5})
			),{
				includeTypes: ["minecraft:redstone_wire"]
			}).getBlockLocationIterator()
			for (const loc of blocks) {
				const vars = new MolangVariableMap()
				vars.setFloat("signal_strength", player.dimension.getBlock(loc).permutation.getState("redstone_signal"))

				player.dimension.spawnParticle("redtools:signal_strength", Vector3Utils.add(loc,{x:0.5,y:0.05,z:0.5}), vars)
			}
		}
	}, 2)
})

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
	if (!event.itemStack) return;
	if (event.itemStack.typeId !== "minecraft:wooden_axe") return;

	event.cancel = true;

	let data = playerData.get(event.player.id);
	if (!data) {
		data = new PlayerSelection(event.player.dimension)
		playerData.set(event.player.id, data);
	}

	system.run(() => {
		data.setPos1(event.block.location)
		data.updateSelection()
	})
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
	if (!event.itemStack) return;
	if (event.itemStack.typeId !== "minecraft:wooden_axe") return;

	event.cancel = true;

	let data = playerData.get(event.player.id);
	if (!data) {
		data = new PlayerSelection(event.player.dimension)
		playerData.set(event.player.id, data);
	}

	data.setPos2(event.block.location)
	data.updateSelection()
})

world.afterEvents.playerBreakBlock.subscribe((event) => {
	console.log("block broken: " + event.brokenBlockPermutation.type.id)
	if (event.brokenBlockPermutation.type.id === "minecraft:barrel") {
		for (const entity of event.block.dimension.getEntities({
			location: event.block.location,
			maxDistance: 5,
			type: "minecraft:item"
		})) {
			entity.kill()
		}
	}
})