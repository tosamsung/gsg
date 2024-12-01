import CropVarietyService from "../service/CropVarietyService";
import CropService from "../service/CropSerivce";

export default class StaticData {
    // Thuộc tính static
    private static cropTileSets: Map<string, any> = new Map<string, any>();
    private static varietyAndCrop: Map<string, any> = new Map<string, String>();
    private static initialized = false;

    static {
        this.initialize();
    }
    public static async initialize(): Promise<void> {
        if (this.initialized) return;
        const cropService = new CropService();
        const cropVarietyService = new CropVarietyService();
        const cropResponse = await cropService.getAllCrop() as any;  
        const varietyCropResponse = await cropVarietyService.getAllVarietyIdAndCropIdPairs() as any;      
        cropResponse.data.forEach((element: any) => {            
            this.cropTileSets.set(element.id, element.tileset);
        });
        varietyCropResponse.data.forEach((element: any) => {            
            this.varietyAndCrop.set(element.id, element.crop_id);
        });
        this.initialized = true;
    }
    
    public static async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }

    public static getCropTileSets(): Map<string, any> {
        if (!this.cropTileSets) {
            throw new Error("StaticData has not been initialized. Call initialize() first.");
        }
        return this.cropTileSets;
    }
    public static getVarietyAndCrop(): Map<string, string> {
        if (!this.varietyAndCrop) {
            throw new Error("StaticData has not been initialized. Call initialize() first.");
        }
        return this.varietyAndCrop;
    }
}

// Gọi phương thức `initialize` để khởi tạo trước khi sử dụng
