import CropVariety from "./CropVariety"

export interface Product {
    id: number,
    quantity: number
    crop_id:CropVariety
}
