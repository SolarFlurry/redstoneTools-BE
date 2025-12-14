import { PlayerSelection } from "./selection";

export const playerData = new Map<string, PlayerData>();

export class PlayerData {
    selection: PlayerSelection
    settings: {
        outline: boolean,
        highlight: boolean,
        redstoneIndicator: boolean,
        autoDust: boolean,
        topHalfSlab: boolean,
    }

    constructor (selection: PlayerSelection) {
        this.selection = selection
        this.settings = {
            outline: true,
            highlight: false,
            redstoneIndicator: true,
            autoDust: false,
            topHalfSlab: true,
        }
    }
}