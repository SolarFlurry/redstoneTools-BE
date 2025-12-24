import { DimensionLocation, MolangVariableMap, RGBA } from "@minecraft/server";
import { Vector3Utils } from "./vector3";

export function drawCube(location: DimensionLocation, color: RGBA, size: number) {
    const vars = new MolangVariableMap()
    vars.setFloat("lifetime", 0.11)
    vars.setColorRGBA("color", color)
    vars.setVector3("size", { x: size/2, y: size/2, z: 0 })
    vars.setVector3("rot", { x: 0, y: 0, z: 1 })
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { z: size / 2 }), vars);
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { z: size / -2 }), vars);
    vars.setVector3("rot", { x: 1, y: 0, z: 0 })
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { x: size / 2 }), vars);
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { x: size / -2 }), vars);
    vars.setVector3("rot", { x: 0, y: 1, z: 0 })
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { y: size / 2 }), vars);
    location.dimension.spawnParticle("redtools:selection", Vector3Utils.add(location, { y: size / -2 }), vars);
}