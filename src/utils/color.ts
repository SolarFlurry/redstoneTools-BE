import { Block } from "@minecraft/server"

export enum Color {
	None = "none",
	Red = "red",
	Orange = "orange",
	Yellow = "yellow",
	Lime = "lime",
	Green = "green",
	Cyan = "cyan",
	LightBlue = "light_blue",
	Blue = "blue",
	Purple = "purple",
	Magenta = "magenta",
	Pink = "pink",
	Brown = "brown",
	LightGray = "light_gray",
	Gray = "gray",
	Black = "black",
	White = "white"
}

export function getColorOf(type: string): Color {
	switch (type) {
		case "minecraft:red_wool": case "minecraft:red_stained_glass": return Color.Red
		case "minecraft:orange_wool": case "minecraft:orange_stained_glass": return Color.Orange
		case "minecraft:yellow_wool": case "minecraft:yellow_stained_glass": return Color.Yellow
		case "minecraft:lime_wool": case "minecraft:lime_stained_glass": return Color.Lime
		case "minecraft:green_wool": case "minecraft:green_stained_glass": return Color.Green
		case "minecraft:cyan_wool": case "minecraft:cyan_stained_glass": return Color.Cyan
		case "minecraft:light_blue_wool": case "minecraft:light_blue_stained_glass": return Color.LightBlue
		case "minecraft:blue_wool": case "minecraft:blue_stained_glass": return Color.Blue
		case "minecraft:purple_wool": case "minecraft:purple_stained_glass": return Color.Purple
		case "minecraft:magenta_wool": case "minecraft:magenta_stained_glass": return Color.Magenta
		case "minecraft:pink_wool": case "minecraft:pink_stained_glass": return Color.Pink
		case "minecraft:brown_wool": case "minecraft:brown_stained_glass": return Color.Brown
		case "minecraft:light_gray_wool": case "minecraft:light_gray_stained_glass": return Color.LightGray
		case "minecraft:gray_wool": case "minecraft:gray_stained_glass": return Color.Gray
		case "minecraft:black_wool": case "minecraft:black_stained_glass": return Color.Black
		case "minecraft:white_wool": case "minecraft:white_stained_glass": return Color.White
		default: return Color.None;
	}
}

export function isGlass(type: string): boolean {
	return type.includes("glass")
}

export function isWool(type: string): boolean {
	return type.includes("wool");
}

export function setGlass(block: Block, color: Color) {
	if (color == Color.None) {
		block.setType("glass");
		return;
	}
	block.setType(`minecraft:${color}_stained_glass`);
}

export function setWool(block: Block, color: Color) {
	if (color == Color.None) {
		block.setType("white_wool");
		return;
	}
	block.setType(`minecraft:${color}_wool`);
}