export default interface CropVariety{
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    name: string;
    crop_id: string;
    id: string;
    description: string;
    scientific_name: string;
    growth_rate: number;
    height_at_maturity: number;
    branching_pattern: string;
    flowering_time: number;
    expected_yield_per_plant: number;
    fruit_size: string;
    fruit_shape: string;
    min_temperature: number;
    max_temperature: number;
    min_humidity: number;
    max_humidity: number;
    min_ph: number;
    max_ph: number;
    soil_type: string[];
    light: string;
    seeding_method_id: string;
    planting_density: number;
    createdById: number;
    updatedById: number;
    growth_duration: number;
    max_growth_duration: number | null;
    leaf_at_maturity: string | null;
    expected_yield_per_square_meter: number;
    min_storage_humidity: number;
    max_storage_humidity: number;
    max_storage_temperature: number;
    min_storage_temperature: number;
    storage_days: number;
    advantages: string;
    points: number;
    expense: number;
}