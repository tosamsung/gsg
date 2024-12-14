// Interface for "pets"
export interface Pet {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    scientific_name: string;
    description: string;
    type: string;
    average_height: number;
    average_weight: number;
    product_time: number;
    product_type: string;
    max_temperature: number;
    min_temperature: number;
    min_humidity: number;
    max_humidity: number;
    light: string;
    special_requirements: string | null;
    water_per_day: number;
    harvest_sign: string;
    egg_yield: number;
    meat_yield: number | null;
    egg_size: string;
    egg_color: string;
    meat_quality: string | null;
    advantages: string;
    points: number;
    density: number;
    expense: number;
    createdById: number;
    updatedById: number;
    product_id: number;
}

// Interface for "pet_cages_id"
export interface PetCage {
    createdAt: string;
    updatedAt: string;
    id: string;
    createdById: string | null;
    updatedById: string | null;
    pets_id: string;
    quantity: number;
    cages_id: string;
    status: string;
    pets: Pet;
}

// Interface for "cage_id"
export interface Cage {
    createdAt: string;
    updatedAt: string;
    plot_id: string;
    id: string;
    createdById: string | null;
    updatedById: string | null;
    status: string;
    pet_cages_id: PetCage[];
}

//   // Root interface
//   interface Root {
//     cage_id: Cage[];
//   }
