import { Entity, Vector3 } from "@minecraft/server";
import { Vector3Utils } from "./vector3";

export function getDirection(entity: Entity): Vector3 {
    const dir = entity.getViewDirection();
    const flatDir = Vector3Utils.normalize({x: dir.x, y: dir.z, z: 0});
    const degrees = (((Math.atan2(flatDir.y, flatDir.x)*(180/Math.PI))%360)+360)%360;
    switch (Math.round(degrees/90)) {
        case 0:
            return {x: 1, y: 0, z: 0}
        case 1:
            return {x: 0, y: 0, z: 1}
        case 2:
            return {x: -1, y: 0, z: 0}
        case 3: 
            return {x: 0, y: 0, z: -1}
        default:
            return {x: 1, y: 0, z: 0}
    }
}