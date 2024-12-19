// plot.ts

import { Bed } from "./Bed";
import { Cage } from "./Pet";

export interface Plot {
    createdAt: string;          // ISO date string format
    updatedAt: string;          // ISO date string format
    plot_number: string;        // Plot number in string format
    width: number;              // Width of the plot
    length: number;             // Length of the plot
    area: number;               // Area of the plot
    status: 'using' | 'new'; // Status of the plot with specific values
    ph: number;                 // pH level of the soil
    humidity: number;           // Humidity level of the plot
    temperature: number;        // Temperature in the plot
    row: number;                // Row position of the plot
    column: number;             // Column position of the plot
    owner_id: number;           // ID of the owner
    id: string;                 // Unique identifier
    createdById: number;        // ID of the user who created this plot
    updatedById: number;        // ID of the user who last updated this plot
    farm_id: string | null;     // ID of the farm if applicable, null if none
    bed: Bed[]
    cage_id: Cage[]

}
