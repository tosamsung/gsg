import ApiManager from "../api/ApiManager";
import { Bed } from "../entity/Bed";

export default class BedService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }

    createBed(bed: Bed) {
        return this.apiManager.createBed(bed)
    }
}