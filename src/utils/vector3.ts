/**
 * This file is a copy of the @minecraft/math module
 */

import { Vector3 } from "@minecraft/server";

function clampNumber(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export class Vector3Utils {
    /**
       * equals
       *
       * Check the equality of two vectors
       */
      static equals(v1: Vector3, v2: Vector3) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
      }
      /**
       * add
       *
       * Add two vectors to produce a new vector
       */
      static add(v1: Vector3, v2: Partial<Vector3>) {
        return { x: v1.x + (v2.x ?? 0), y: v1.y + (v2.y ?? 0), z: v1.z + (v2.z ?? 0) };
      }
      /**
       * subtract
       *
       * Subtract two vectors to produce a new vector (v1-v2)
       */
      static subtract(v1: Vector3, v2: Partial<Vector3>) {
        return { x: v1.x - (v2.x ?? 0), y: v1.y - (v2.y ?? 0), z: v1.z - (v2.z ?? 0) };
      }
      /** scale
       *
       * Multiple all entries in a vector by a single scalar value producing a new vector
       */
      static scale(v1: Vector3, scale: number) {
        return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
      }
      /**
       * dot
       *
       * Calculate the dot product of two vectors
       */
      static dot(a: Vector3, b: Vector3) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
      }
      /**
       * cross
       *
       * Calculate the cross product of two vectors. Returns a new vector.
       */
      static cross(a: Vector3, b: Vector3) {
        return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
      }
      /**
       * magnitude
       *
       * The magnitude of a vector
       */
      static magnitude(v: Vector3) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
      }
      /**
       * distance
       *
       * Calculate the distance between two vectors
       */
      static distance(a: Vector3, b: Vector3) {
        return Vector3Utils.magnitude(Vector3Utils.subtract(a, b));
      }
      /**
       * normalize
       *
       * Takes a vector 3 and normalizes it to a unit vector
       */
      static normalize(v: Vector3) {
        const mag = Vector3Utils.magnitude(v);
        return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
      }
      /**
       * floor
       *
       * Floor the components of a vector to produce a new vector
       */
      static floor(v: Vector3) {
        return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
      }
      /**
       * toString
       *
       * Create a string representation of a vector3
       */
      static toString(v: Vector3, options?: {decimals, delimiter}) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
        return str.join(options?.delimiter ?? ", ");
      }
      /**
       * fromString
       *
       * Gets a Vector3 from the string representation produced by {@link Vector3Utils.toString}. If any numeric value is not a number
       * or the format is invalid, undefined is returned.
       * @param str - The string to parse
       * @param delimiter - The delimiter used to separate the components. Defaults to the same as the default for {@link Vector3Utils.toString}
       */
      static fromString(str: string, delimiter: string = ",") {
        const parts = str.split(delimiter);
        if (parts.length !== 3) {
          return void 0;
        }
        const output = parts.map((part) => parseFloat(part));
        if (output.some((part) => isNaN(part))) {
          return void 0;
        }
        return { x: output[0], y: output[1], z: output[2] };
      }
      /**
       * clamp
       *
       * Clamps the components of a vector to limits to produce a new vector
       */
      static clamp(v: Vector3, limits) {
        return {
          x: clampNumber(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
          y: clampNumber(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
          z: clampNumber(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER)
        };
      }
      /**
       * lerp
       *
       * Constructs a new vector using linear interpolation on each component from two vectors.
       */
      static lerp(a: Vector3, b: Vector3, t: number) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
      }
      /**
       * slerp
       *
       * Constructs a new vector using spherical linear interpolation on each component from two vectors.
       */
      static slerp(a: Vector3, b: Vector3, t: number) {
        const theta = Math.acos(Vector3Utils.dot(a, b));
        const sinTheta = Math.sin(theta);
        const ta = Math.sin((1 - t) * theta) / sinTheta;
        const tb = Math.sin(t * theta) / sinTheta;
        return Vector3Utils.add(Vector3Utils.scale(a, ta), Vector3Utils.scale(b, tb));
      }
      /**
       * multiply
       *
       * Element-wise multiplication of two vectors together.
       * Not to be confused with {@link Vector3Utils.dot} product or {@link Vector3Utils.cross} product
       */
      static multiply(a: Vector3, b: Vector3) {
        return { x: a.x * b.x, y: a.y * b.y, z: a.z * b.z };
      }
      /**
       * rotateX
       *
       * Rotates the vector around the x axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateX(v: Vector3, a: number) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return { x: v.x, y: v.y * cos - v.z * sin, z: v.z * cos + v.y * sin };
      }
      /**
       * rotateY
       *
       * Rotates the vector around the y axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateY(v: Vector3, a: number) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return { x: v.x * cos + v.z * sin, y: v.y, z: v.z * cos - v.x * sin };
      }
      /**
       * rotateZ
       *
       * Rotates the vector around the z axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateZ(v: Vector3, a: number) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return { x: v.x * cos - v.y * sin, y: v.y * cos + v.x * sin, z: v.z };
      }
      static new(x: number, y: number, z: number): Vector3 {
        return {x, y, z}
      }
}