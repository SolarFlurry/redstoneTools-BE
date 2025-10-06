import { CommandPermissionLevel, CustomCommand, CustomCommandParamType, CustomCommandResult, CustomCommandStatus } from '@minecraft/server'

export const StackCommand: CustomCommand = {
	name: "redtools:stack",
	description: "Stacks selection",
	permissionLevel: CommandPermissionLevel.Any,
	cheatsRequired: true,
	mandatoryParameters: [
		{
			name: "stackAmount",
			type: CustomCommandParamType.Integer
		},
		{
			name: "redtools:direction",
			type: CustomCommandParamType.Enum
		}
	],
	optionalParameters: [
		{
			name: "stackOffset",
			type: CustomCommandParamType.Integer
		}
	]
}

export function stackCommandExecute(origin, stackAmount: number, direction, stackOffset: number): CustomCommandResult {
	return {
		status: CustomCommandStatus.Failure
	}
}