import { TileData } from "@/entity/TileData";
import { Area } from "../entity/Area"; // Assuming Area is defined elsewhere

/**
 * Loads tilesets into the room based on the given area and tileset data.
 * @param area The area where tiles should be placed.
 * @param tileset The tile data to use for rendering.
 * @param layer The layer in the room to apply the tiles.
 */
export function loadTilesetByArea(area: Area, tileset: string | number | null, layer: string): void {
    const tiles: TileData[] = [];

    for (let row = 0; row < area.height; row++) {
        for (let col = 0; col < area.width; col++) {
            tiles.push({
                x: col + area.coordinate.x,
                y: row + area.coordinate.y,
                tile: tileset, // Cycles through the tileset array
                layer: layer,
            });
        }
    }

    WA.room.setTiles(tiles);
}
