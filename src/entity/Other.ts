import { Plot } from "./Plot";

export interface Coordinate{
    x:number,
    y:number,
}

export interface Area{
    coordinate:Coordinate,
    height:number,
    width:number
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

export interface PlotArea{
    plotArea:Area;
    plot:Plot;
    index:number;
}