import { world, system, StartupEvent, BlockVolume, MolangVariableMap } from '@minecraft/server'
import { Vector3Utils } from 'utils/vector3'
import { PlayerSelection } from 'core/selection'
import { PlayerData, playerData } from 'core/player'
import { StackCommand, stackCommandExecute } from 'commands/stack'
import { SignalStrengthCommand, signalStrengthExecute } from 'commands/signalstrength'
import { debugDrawer } from '@minecraft/debug-utilities'
import { SetCommand, setCommandExecute } from 'commands/set'
import { MoveCommand, moveCommandExecute } from 'commands/move'
import { getRange } from 'utils/range'
import { SettingsCommand, settingsCommandExecute } from 'commands/settings'
import { ColorcodeCommand, colorcodeCommandExecute } from 'commands/colorcode'
import { RotateCommand, rotateCommandExecute } from 'commands/rotate'
import { LibraryCommand, libraryCommandExecute } from 'commands/library'
import { CopyCommand, copyCommandExecute } from 'commands/copy'
import { PasteCommand, pasteCommandExecute } from 'commands/paste'
import JobPromise from 'utils/runjob'
import { PreviewCommand, previewCommandExecute } from 'commands/preview'

system.beforeEvents.startup.subscribe((init: StartupEvent) => {
	init.customCommandRegistry.registerEnum("redtools:direction", ["r", "l", "f", "b", "u", "d", "right", "left", "front", "back", "up", "down"])
	init.customCommandRegistry.registerEnum("redtools:color", ["red", "orange", "yellow", "lime", "green", "cyan", "light_blue", "blue", "purple", "magenta", "pink", "brown", "light_gray", "gray", "black", "white"])
	init.customCommandRegistry.registerCommand(StackCommand, stackCommandExecute)
	init.customCommandRegistry.registerCommand(SignalStrengthCommand, signalStrengthExecute)
	init.customCommandRegistry.registerCommand(SetCommand, setCommandExecute)
	init.customCommandRegistry.registerCommand(MoveCommand, moveCommandExecute)
	init.customCommandRegistry.registerCommand(SettingsCommand, settingsCommandExecute)
	init.customCommandRegistry.registerCommand(ColorcodeCommand, colorcodeCommandExecute)
	init.customCommandRegistry.registerCommand(RotateCommand, rotateCommandExecute)
	init.customCommandRegistry.registerCommand(LibraryCommand, libraryCommandExecute)
	init.customCommandRegistry.registerCommand(CopyCommand, copyCommandExecute)
	init.customCommandRegistry.registerCommand(PasteCommand, pasteCommandExecute)
	init.customCommandRegistry.registerCommand(PreviewCommand, previewCommandExecute)
})

world.afterEvents.playerJoin.subscribe((event) => {
	playerData.set(event.playerId, new PlayerData(
		new PlayerSelection(world.getDimension("minecraft:overworld"))
	))
})

world.beforeEvents.playerLeave.subscribe((event) => {
	let data = playerData.get(event.player.id);
	if (!data) return;
	data.selection.removeSelection()
	playerData.delete(event.player.id);
})

world.afterEvents.worldLoad.subscribe((event) => {
	console.log("world loaded")
	let ticks = 0;
	system.runInterval(() => {
		if (ticks >= 360) ticks %= 360;
		const players = world.getAllPlayers();
		for (const player of players) {
			const data = playerData.get(player.id);
			if (!data) continue;

			// selection highlight
			if (data.settings.highlight) {
				const [lower, upper] = getRange(data.selection.points[0], data.selection.points[1]);
				let vars = new MolangVariableMap();
				vars.setFloat("lifetime", 0.06)
				vars.setColorRGBA("color", { red: 1, green: 0, blue: 0, alpha: (Math.sin(5 * ticks * Math.PI / 180) / 2 + 0.5) * 0.05 })
				vars.setVector3("size", { x: data.selection.bounds().x / 2 + 0.01, y: data.selection.bounds().y / 2 + 0.01, z: 0 })
				vars.setVector3("rot", { x: 0, y: 0, z: 1 })
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: data.selection.bounds().x / 2, y: data.selection.bounds().y / 2, z: -0.01 }), vars);
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: data.selection.bounds().x / 2, y: data.selection.bounds().y / 2, z: data.selection.bounds().z + 0.01 }), vars);
				vars.setVector3("size", { x: data.selection.bounds().z / 2 + 0.01, y: data.selection.bounds().y / 2 + 0.01, z: 0 })
				vars.setVector3("rot", { x: 1, y: 0, z: 0 })
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: -0.01, y: data.selection.bounds().y / 2, z: data.selection.bounds().z / 2 }), vars);
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: data.selection.bounds().x + 0.01, y: data.selection.bounds().y / 2, z: data.selection.bounds().z / 2 }), vars);
				vars.setVector3("size", { x: data.selection.bounds().x / 2 + 0.01, y: data.selection.bounds().z / 2 + 0.01, z: 0 })
				vars.setVector3("rot", { x: 0, y: 1, z: 0 })
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: data.selection.bounds().x / 2, y: -0.01, z: data.selection.bounds().z / 2 }), vars);
				player.dimension.spawnParticle("redtools:selection", Vector3Utils.add(lower, { x: data.selection.bounds().x / 2, y: data.selection.bounds().y + 0.01, z: data.selection.bounds().z / 2 }), vars);
			}

			// redstone dust signal indicator
			const blocks = player.dimension.getBlocks(new BlockVolume(
				Vector3Utils.subtract(player.location, { x: 5, y: 5, z: 5 }),
				Vector3Utils.add(player.location, { x: 5, y: 5, z: 5 })
			), {
				includeTypes: ["minecraft:redstone_wire"]
			}).getBlockLocationIterator()
			for (const loc of blocks) {
				const vars = new MolangVariableMap()
				vars.setFloat("lifetime", 0.06)
				vars.setFloat("signal_strength", player.dimension.getBlock(loc).permutation.getState("redstone_signal"))

				player.dimension.spawnParticle("redtools:signal_strength", Vector3Utils.add(loc, { x: 0.5, y: 0.05, z: 0.5 }), vars)
			}

			if (data.previewClipboard) {
				const min = Vector3Utils.new(0, 0, 0)
				const max = data.clipboardSize
				const vertices = [
					Vector3Utils.new(min.x, min.y, min.z),
					Vector3Utils.new(max.x, min.y, min.z),
					Vector3Utils.new(min.x, max.y, min.z),
					Vector3Utils.new(max.x, max.y, min.z),
					Vector3Utils.new(min.x, min.y, max.z),
					Vector3Utils.new(max.x, min.y, max.z),
					Vector3Utils.new(min.x, max.y, max.z),
					Vector3Utils.new(max.x, max.y, max.z),
				];
				const edges: [number, number][] = [
					[0, 1],
					[2, 3],
					[4, 5],
					[6, 7],
					[0, 2],
					[1, 3],
					[4, 6],
					[5, 7],
					[0, 4],
					[1, 5],
					[2, 6],
					[3, 7],
				];
				const vars = new MolangVariableMap();
				vars.setColorRGB("dot_color", {red: 1, green: 1, blue: 1})
				vars.setFloat("lifetime", 0.06)
				new JobPromise(function* () {for (const edge of edges) {
					const [startVertex, endVertex] = [vertices[edge[0]], vertices[edge[1]]];
					const resolution = Math.min(Math.floor(Vector3Utils.magnitude(Vector3Utils.subtract(endVertex,startVertex))), 16);
					for (let i = 0; i <= resolution; i++) {
						const t = i / resolution;
						player.dimension.spawnParticle("redtools:outline", Vector3Utils.floor(Vector3Utils.add(data.copyLocDiff, Vector3Utils.add(player.location, Vector3Utils.lerp(startVertex, endVertex, t)))), vars)
						yield;
					}
				}}, (progress) => {})
			}
		}
		ticks += 1;
	}, 1)
})

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
	if (!event.itemStack) return;
	if (event.itemStack.typeId !== "minecraft:wooden_axe") return;

	event.cancel = true;

	let data = playerData.get(event.player.id);
	if (!data) {
		data = new PlayerData(new PlayerSelection(event.player.dimension))
		playerData.set(event.player.id, data);
	}

	system.run(() => {
		data.selection.setPos1(event.block.location)
		data.selection.updateSelection()
	})
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
	if (!event.itemStack) return;
	if (event.itemStack.typeId !== "minecraft:wooden_axe") return;

	event.cancel = true;

	let data = playerData.get(event.player.id);
	if (!data) {
		data = new PlayerData(new PlayerSelection(event.player.dimension))
		playerData.set(event.player.id, data);
	}

	system.run(() => {
		data.selection.setPos2(event.block.location)
		data.selection.updateSelection()
	})
})

world.afterEvents.playerBreakBlock.subscribe((event) => {
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

world.afterEvents.playerPlaceBlock.subscribe((event) => {
	let data = playerData.get(event.player.id);
	if (data?.settings.topHalfSlab && event.block.typeId.includes("slab")) {
		event.block.setPermutation(event.block.permutation.withState("minecraft:vertical_half", "top"));
	}
	if (data?.settings.autoDust) {
		event.block.above().setType("redstone_wire");
	}
})