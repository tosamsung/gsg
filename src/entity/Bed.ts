import CropVariety from "./CropVariety";
import { Plot } from "./Plot";

export default interface Bed {
    id?:string,
    expected_harvest_yield: number,
    flowering_date: Date,
    crop_variety: CropVariety,
    crop_variety_id?:string,
    plot: Plot,
    length: number,
    harvest_date: Date,
    planting_date:Date,
    width: number,
    bed_number:number,
    status:string
}