import { Bed } from "./Bed";
import { Plot } from "./Plot";

export interface Coordinate {
    x: number,
    y: number,
}

export interface Area {
    coordinate: Coordinate,
    height: number,
    width: number
}
export interface MovementState {
    direction: "left" | "right" | "up" | "down"; // Limit direction to specific string values
    moving: boolean; // Indicates if movement is occurring
    x: number; // X-coordinate
    y: number; // Y-coordinate
    oldX?: number;
    oldY?: number;
}

export interface TileData {
    x: number;
    y: number;
    tile: string | number | null;
    layer: string;
}

export interface PlotArea {
    area: Area;
    plot: Plot;
    index?: number;
}
export interface BedArea {
    name: string
    index: number
    area: Area
    bed: Bed
}
export interface MyTileDescriptor {
    cols: number;
    rows: number;
    tilesets: string[][] | number[][]
}