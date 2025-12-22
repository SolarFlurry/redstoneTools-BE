import { Dimension, Vector3 } from "@minecraft/server";
import { PlayerSelection } from "./selection";
import { RegionBlock } from "./region";
import { Vector3Utils } from "utils/vector3";

export const playerData = new Map<string, PlayerData>();

export class PlayerData {
    selection: PlayerSelection
    clipboard: Map<Vector3, RegionBlock>;
    previewClipboard: boolean
    clipboardSize: Vector3
    copyLocDiff: Vector3
    settings: {
        outline: boolean,
        highlight: boolean,
        redstoneIndicator: boolean,
        autoDust: boolean,
        topHalfSlab: boolean,
        sizeRelativeOffset: boolean,
        hologramPreview: boolean,
    }

    constructor(selection: PlayerSelection) {
        this.previewClipboard = false
        this.clipboard = new Map()
        this.selection = selection
        this.settings = {
            outline: true,
            highlight: false,
            redstoneIndicator: true,
            autoDust: false,
            topHalfSlab: true,
            sizeRelativeOffset: false,
            hologramPreview: false,
        }
    }

    public *copySelection(from: Vector3): Generator<void, void, void> {
        this.clipboard.clear()
        this.clipboardSize = this.selection.bounds()
        yield* this.selection.iterateOverRange((pos, start) => {
            const diff = Vector3Utils.subtract(start, Vector3Utils.floor(from))
            this.copyLocDiff = diff
            console.log(this.selection.dimension.getBlock(Vector3Utils.add(pos, start)).typeId)
            this.clipboard.set(Vector3Utils.add(pos, diff), RegionBlock.fromBlock(this.selection.dimension.getBlock(Vector3Utils.add(pos, start))))
        })
    }
    public *pasteClipboard(location: Vector3, dimension: Dimension): Generator<void, void, void> {
        for (const [key, value] of this.clipboard) {
            value.place(dimension, Vector3Utils.add(key, location))
            yield;
        }
    }
}