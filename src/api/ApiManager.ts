import HttpClient from "./HttpClient"
import Bed from "../entity/Bed"
import { RequestFarming } from "../entity/Request"

const DIGIFORCE_DOMAIN = import.meta.env.VITE_DIGIFORCE_API_URL
    ? import.meta.env.VITE_DIGIFORCE_API_URL.replace(/\/$/, '')
    : ''

const DIGIFORCE_URL_API = DIGIFORCE_DOMAIN + '/api'
const DIGOFORCE_API_KEY = localStorage.getItem("DIGIFORCE_TOKEN") || ""
export default class ApiManager {
    private httpDigiforce!: HttpClient
    constructor() {
        this.httpDigiforce = new HttpClient(DIGIFORCE_URL_API)
    }

    getAllPlots() {
        const URI = "/plot:list?filter=%7B%7D&except=updatedAt%2CcreatedAt%2Cph%2Ctemperature%2Chumidity%2CcreatedById%2CupdatedById";
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getPlotById(plotId: String) {
        const URI = `/plot:get?filterByTk=${plotId}&appends[]=owner&appends[]=bed&appends[]=bed.crop_variety`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getPlotByIdPrunedData(plotId: String) {
        const URI = `/plot:get?filterByTk=${plotId}`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getAllPlotByColsAndRow(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
        const URI = `/plot:list?pageSize=20&sort[]=plot_number&appends[]=owner&appends[]=bed&appends[]=farm&page=1&filter=%7B%22$and%22:[%7B%22column%22:%7B%22$gte%22:${colStart}%7D%7D,%7B%22column%22:%7B%22$lte%22:${colEnd}%7D%7D,%7B%22row%22:%7B%22$lte%22:${rowEnd}%7D%7D,%7B%22row%22:%7B%22$gte%22:${rowStart}%7D%7D]%7D`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getAllPlotByColsAndRowPrunedData(colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
        const URI = `/plot:list?pageSize=20&sort[]=plot_number&appends[]=bed&page=1&filter=%7B%22$and%22:[%7B%22column%22:%7B%22$gte%22:${colStart}%7D%7D,%7B%22column%22:%7B%22$lte%22:${colEnd}%7D%7D,%7B%22row%22:%7B%22$lte%22:${rowEnd}%7D%7D,%7B%22row%22:%7B%22$gte%22:${rowStart}%7D%7D]%7D`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getPlotByColAndRow(col: number, row: number) {
        const URI = `/plot:list?pageSize=20&sort[]=plot_number&appends[]=owner&appends[]=bed&appends[]=farm&page=1&filter=%7B%22$and%22:[%7B%22column%22:%7B%22$eq%22:${col}%7D%7D,%7B%22row%22:%7B%22$eq%22:${row}%7D%7D]%7D`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getPlotByColAndRowPrunedData(col: number, row: number) {
        const URI = `/plot:list?pageSize=20&sort[]=plot_number&page=1&filter=%7B%22$and%22:[%7B%22column%22:%7B%22$eq%22:${col}%7D%7D,%7B%22row%22:%7B%22$eq%22:${row}%7D%7D]%7D`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    updatePlot(plot: any) {
        const URI = `/plot:update?filterByTk=${plot.id}&updateAssociationValues[]=bed`
        return this.httpDigiforce.get(URI, plot, DIGOFORCE_API_KEY);
    }
    getPlotByPlotNumber(plotNumber: string) {
        const URI = `/plot:get?filter=%7B%0A%22plot_number%22%3A%20%22${plotNumber}%22%0A%7D%0A`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    //request plot
    createRequestRegisterPlot(plotId: string) {
        const URI = `/plot_register_history:create`
        return this.httpDigiforce.post(URI, { plot_id: plotId }, 'application/json', DIGOFORCE_API_KEY);
    }
    getRequestRegisterPlotById(requestId: string) {
        const URI = `/plot_register_history:get?filterByTk=${requestId}&appends\[\]=plot`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    //request farming
    createRequestFarming(requestFarming:RequestFarming){
        const URI = `/farming_history:create`
        return this.httpDigiforce.post(URI, requestFarming, 'application/json', DIGOFORCE_API_KEY);
    }
    getRequestFarmingById(requestId: string) {
        const URI = `/farming_history:get?filterByTk=${requestId}&appends\[\]=plot&appends\[\]=bed&appends\[\]=product`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }

    getUserById(userId: number) {
        const URI = `/users:get?filterByTk=${userId}&filter=%7B%7D`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }

    createBed(bed: Bed) {
        const URI = `/bed:create`;
        return this.httpDigiforce.post(URI, bed, 'application/json', DIGOFORCE_API_KEY);
    }
    updateBed() {
        // const URI = `/plot:update?filterByTk=${plot.id}&updateAssociationValues[]=bed`
        // return this.httpDigiforce.get(URI, plot, DIGOFORCE_API_KEY);
    }
    getAllCrops() {
        const URI = `/crop:list?pageSize=20&filter=%7B%7D`;
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getCropVarietyById(varietyId: string) {
        const URI = `/crop_variety:get?filterByTk=${varietyId}`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getCropByVarietyId(varietyId: string) {
        const URI = `/crop_variety:get?filterByTk=${varietyId}&appends[]=crop&filter=%7B%7D&fields=crop_id`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }

    getBedByBedNumberAndPlotId(bedNumber: number, plotId: string) {
        const URI = `/bed:get?filter=%7B%0A%22plot_id%22%3A%22${plotId}%22%2C%0A%22bed_number%22%3A${bedNumber}%0A%7D%0A`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    getAllVarietyIdAndCropIdPairs() {
        const URI = `/crop_variety:list?filter=%7B%7D&fields=id%2Ccrop_id`
        return this.httpDigiforce.get(URI, undefined, DIGOFORCE_API_KEY);
    }
    auth(token: string) {
        const URI = `/auth:check`
        return this.httpDigiforce.get(URI, undefined, token);
    }

}