import { PlayerSelection } from "./selection";

export const playerData = new Map<string, PlayerData>();

export class PlayerData {
    selection: PlayerSelection
    settings: {
        outline: boolean,
        highlight: boolean,
        redstoneIndicator: boolean,
    }

    constructor (selection: PlayerSelection) {
        this.selection = selection
        this.settings = {
            outline: true,
            highlight: false,
            redstoneIndicator: true,
        }
    }
}