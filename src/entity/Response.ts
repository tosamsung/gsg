import { Bed } from "./Bed";
import { Plot } from "./Plot";

export interface ResponsePlotRegister {
    status: string,
    id: string;
    plot_id: string;
    plot: Plot;
    createdById: number,
    updatedById: number,
    createdAt: string,
    updatedAt: string,
    user_id: number;
    message: string;
    amount: number;
}
export interface ResponseFarmingRequest {
    updatedAt: string; // ISO Date string
    createdAt: string; // ISO Date string
    status: "new" | "pending" | "preparing" | "in_progress" | "completed" | "canceled" // Add other possible statuses as needed
    id: string; // UUID
    plot_id: string | null; // Optional Plot ID (UUID)
    bed_id: string; // UUID
    action: "planting" | "watering" | "fertilizing" | "feeding" | "harvesting" | "raising" | "pet_watering"; // Add other possible actions as needed
    createdById: number; // User ID
    updatedById: number; // User ID
    user_id: number | null; // Optional User ID
    message: string | null; // Optional message
    note: string | null; // Optional note
    product_id: number | null; // Optional Product ID
    quantity: number | null; // Optional quantity
    uom_id: number | null; // Optional Unit of Measure ID
    cost: number | null; // Optional cost
    bed: Bed ;

}