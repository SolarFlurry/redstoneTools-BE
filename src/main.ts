import { world, system, StartupEvent } from '@minecraft/server'
import { Vector3Utils } from '@minecraft/math'
import { PlayerSelection } from 'core/selection'
import { StackCommand, stackCommandExecute } from 'commands/stack'

system.beforeEvents.startup.subscribe((init: StartupEvent) => {
	init.customCommandRegistry.registerEnum("redtools:direction", ["r", "l", "f", "b", "u", "d", "right", "left", "front", "back", "up", "down"])
	init.customCommandRegistry.registerCommand(StackCommand, stackCommandExecute)
})