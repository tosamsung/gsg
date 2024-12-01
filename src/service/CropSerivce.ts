import ApiManager from "../api/ApiManager";

export default class CropService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }

    getCropByVarietyId(varietyId: string) {
        return this.apiManager.getCropByVarietyId(varietyId)
    }
    getAllCrop(){
        return this.apiManager.getAllCrops()
    }
}