import Bed from "../entity/Bed";
import ApiManager from "../api/ApiManager";

export default class BedService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }

    createBed(bed: Bed) {
        return this.apiManager.createBed(bed)
    }
    isBedPlanted(bed: Bed): Promise<boolean> {
        return this.apiManager
            .getBedByBedNumberAndPlotId(bed.bed_number, bed.plot.id)
            .then((response: any) => {
                // Kiểm tra nếu luống đã được trồng
                if (response && response.isPlanted) {
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.error("Error checking if bed is planted:", error);
                return false; // Mặc định trả về false nếu có lỗi
            });
    }
    

}