import {
  CommandPermissionLevel,
  CustomCommand,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  Vector2,
  Vector3,
} from "@minecraft/server";
import { playerData } from "core/player";
import { getRange } from "utils/range";
import JobPromise from "utils/runjob";
import { Vector3Utils } from "utils/vector3";

export const FlipCommand: CustomCommand = {
  name: "redtools:flip",
  description: "flips the selection",
  permissionLevel: CommandPermissionLevel.Any,
  cheatsRequired: true,
  mandatoryParameters: [
    {
        name: "rotation",
        type: CustomCommandParamType.Integer,
    },
  ],
};

export function rotateCommandExecute(origin: CustomCommandOrigin, rotation: number) {
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

    let rotate: (vec: Vector2) => Vector2;

    switch ((Math.round(rotation/90)%4+4)%4) {
        case 0:
            rotate = (vec) => vec
            break;
        case 1:
            rotate = (vec) => <Vector2>{x: vec.y, y: -vec.x}
            break;
        case 2:
            rotate = (vec) => <Vector2>{x: -vec.x, y: -vec.y}
            break;
        case 3:
            rotate = (vec) => <Vector2>{x: -vec.y, y: vec.x}
            break;
    }
    const center = Vector3Utils.subtract(Vector3Utils.multiply(data.selection.bounds(), {x: 0.5, y: 0.5, z: 0.5}), {x: 0.5, y: 0.5, z: 0.5});
    const [lower, upper] = getRange(data.selection.points[0], data.selection.points[1]);
    console.log(Vector3Utils.toString(center))
    new JobPromise(data.selection.getRegion({includeAir: true}), (progress) => {}).then(() => {
    new JobPromise(data.selection.iterateOverRange((pos, start) => {
        data.selection.dimension.setBlockType(Vector3Utils.add(pos, start), "minecraft:air");
    }), (progress) => {}).then(() => {
    new JobPromise(data.selection.iterateOverBlocks((pos, block) => {
        let centerfied = Vector3Utils.subtract(pos, center)
        let rotaterfied = rotate ({x: centerfied.x, y: centerfied.z})
        let rotated = {x: rotaterfied.x, y: centerfied.y, z: rotaterfied.y}
        let final = Vector3Utils.add(center, rotated);
        console.log(Vector3Utils.toString(final))
        block.place(data.selection.dimension, Vector3Utils.add(lower, final))
    }), (progress) => {})
    })})
}
