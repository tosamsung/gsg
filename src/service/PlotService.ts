import ApiManager from "../api/ApiManager";
import { ResponsePlotRegister } from "../entity/Response";

export default class plotService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }
    createRequestRegisterPlot(plotId: string): Promise<ResponsePlotRegister> {
        return new Promise((resolve, reject) => {
            this.apiManager.createRequestRegisterPlot(plotId).then((response: any) => {
                const requestPlotRegister = response.data as ResponsePlotRegister;

                let attempts = 0;
                const maxAttempts = 3;
                const delay = 2000;

                const checkStatus = (id: string) => {
                    this.apiManager.getRequestRegisterPlotById(id).then((response: any) => {
                        const updatedRequest = response.data as ResponsePlotRegister;

                        if (updatedRequest.status !== "new") {
                            resolve(updatedRequest);
                            return;
                        }

                        if (attempts >= maxAttempts) {
                            reject(new Error("Request vẫn đang xử lý sau 3 lần thử."));
                            return;
                        }
                        attempts++;
                        setTimeout(() => checkStatus(id), delay);
                    }).catch((error) => {
                        reject(new Error(`Lỗi khi gọi API: ${error.message}`));
                    });
                };
                checkStatus(requestPlotRegister.id);
            }).catch((error) => {
                reject(new Error(`Lỗi khi tạo request: ${error.message}`)); // Xử lý lỗi ban đầu
            });
        });
    }

    getPlotsByGroupNumber(groupNumber: number) {
        const farmId = localStorage.getItem("farm") as number | null
        if (farmId) {
            return this.apiManager.getPlotsByGroupNumberAndFarmId(groupNumber, farmId)
        }else{
            throw new Error("Farm id null");
        }
    }
    getPlotByIdPrunedData(id: string) {
        return this.apiManager.getPlotByIdPrunedData(id)
    }
    // getAllPlotByColsAndRow(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
    //     return this.apiManager.getAllPlotByColsAndRow(colStart, colEnd, rowStart, rowEnd)
    // }
    // getPlotByColAndRow(col: number, row: number) {
    //     return this.apiManager.getPlotByColAndRow(col, row)
    // }
    getPlotByPlotNumber(plotNumber: string) {
        return this.apiManager.getPlotByPlotNumber(plotNumber)
    }
    // getPlotByColAndRowPrunedData(col: number, row: number) {
    //     return this.apiManager.getPlotByColAndRowPrunedData(col, row)
    // }
    // getAllPlotByColsAndRowPrunedData(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
    //     return this.apiManager.getAllPlotByColsAndRowPrunedData(colStart, colEnd, rowStart, rowEnd)
    // }
}