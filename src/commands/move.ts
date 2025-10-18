import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandStatus } from "@minecraft/server";
import { playerData } from "core/selection";
import { getDirection } from "utils/direction";
import JobPromise from "utils/runjob";
import { Vector3Utils } from "utils/vector3";

export const MoveCommand: CustomCommand = {
    name: "redtools:move",
    description: "moves the selection",
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: true,
    mandatoryParameters: [
        {
            name: "moveAmount",
            type: CustomCommandParamType.Integer
        },
        {
            name: "redtools:direction",
            type: CustomCommandParamType.Enum
        }
    ]
}

export function moveCommandExecute(origin: CustomCommandOrigin, moveAmount: number, direction: string) {
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
    let dirVector = getDirection(origin.sourceEntity)
    switch (direction) {
        case "f": case "front":
            dirVector = {x: dirVector.x, y: dirVector.y, z: dirVector.z}
            break;
        case "b": case "back":
            dirVector = {x: -dirVector.x, y: dirVector.y, z: -dirVector.z}
            break;
        case "r": case "right":
            dirVector = {x: -dirVector.z, y: dirVector.y, z: dirVector.x}
            break;
        case "l": case "left":
            dirVector = {x: dirVector.z, y: dirVector.y, z: -dirVector.x}
            break;
        case "u": case "up":
            dirVector = {x: 0, y: 1, z: 0}
            break;
        case "d": case "down":
            dirVector = {x: 0, y: -1, z: 0}
            break;
    }
    new JobPromise(data.getRegion({includeAir: false}), (progress) => {}).then(() => {
    new JobPromise(data.iterateOverRange((pos, start) => {
        data.dimension.setBlockType(Vector3Utils.add(pos, start), "minecraft:air");
        }), (progress) => {}).then(() => {
    data.setPos1(Vector3Utils.add(data.points[0], Vector3Utils.scale(dirVector, moveAmount)))
    data.setPos2(Vector3Utils.add(data.points[1], Vector3Utils.scale(dirVector, moveAmount)))
    data.updateSelection()
    new JobPromise(data.setRegion(data.points[0]), (progress) => {})
    })})
}