import { Block, BlockPermutation, Dimension, ItemStack, Vector3 } from "@minecraft/server";

export class RegionBlock {
    private constructor() {};

    block: BlockPermutation;
    inventory: ItemStack[];

    public place(dimension: Dimension, location: Vector3): void {
        const block = dimension.getBlock(location);
        block.setPermutation(this.block);
        const inventory = block.getComponent("minecraft:inventory");
        if (inventory) {
            for (const item of this.inventory) {
                inventory.container.addItem(item)
            }
        }
    }

    static fromBlock(block: Block): RegionBlock {
        const regionBlock = new RegionBlock();
        regionBlock.block = block.permutation;
        const inventory = block.getComponent("minecraft:inventory")
        if (inventory) {
            regionBlock.inventory = []
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                if (item) {
                    regionBlock.inventory.push(item);
                }
            }
        }
        return regionBlock
    }
}