import ApiManager from "../api/ApiManager";

export default class plotService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }
    getPlotByIdPrunedData(id:string){
        return this.apiManager.getPlotByIdPrunedData(id)
    }
    getAllPlotByColsAndRow(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
        return this.apiManager.getAllPlotByColsAndRow(colStart, colEnd, rowStart, rowEnd)
    }
    getPlotByColAndRow(col: number, row: number) {
        return this.apiManager.getPlotByColAndRow(col, row)
    }
    getPlotByPlotNumber(plotNumber: string) {
        return this.apiManager.getPlotByPlotNumber(plotNumber)
    }
    getPlotByColAndRowPrunedData(col: number, row: number) {
        return this.apiManager.getPlotByColAndRowPrunedData(col, row)
    }
    getAllPlotByColsAndRowPrunedData(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
        return this.apiManager.getAllPlotByColsAndRowPrunedData(colStart, colEnd, rowStart, rowEnd)
    }
}