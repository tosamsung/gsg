import ApiManager from "../api/ApiManager";

export default class CropVarietyService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }

    getCropVarietyById(varietyId: string) {
        return this.apiManager.getCropVarietyById(varietyId)
    }
    getAllVarietyIdAndCropIdPairs(){
        return this.apiManager.getAllVarietyIdAndCropIdPairs()

    }
}