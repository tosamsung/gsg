export interface MovementState {
    direction: "left" | "right" | "up" | "down"; // Limit direction to specific string values
    moving: boolean; // Indicates if movement is occurring
    x: number; // X-coordinate
    y: number; // Y-coordinate
}
