import ApiManager from "../api/ApiManager";
import { Bed } from "../entity/Bed";
import { RequestFarming, RequestPet } from "../entity/Request";
import { ResponseFarmingRequest } from "../entity/Response";

export default class FarmService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }
    //plant
    createPlantingRequest(productId: number): Promise<any> {
        if (!WA.player.state.bed) {
            throw new Error("Couldn't find bed");
        }

        const requestFarming = {
            bed_id: (WA.player.state.bed as Bed).id,
            product: {
                id: productId,
            },
            action: "planting",
        } as RequestFarming;

        return new Promise((resolve, reject) => {
            this.apiManager.createRequestPlanting(requestFarming).then((response: any) => {
                const responsePlantingRequest = response.data as ResponseFarmingRequest;

                let elapsedTime = 0;
                const intervalId = setInterval(() => {
                    elapsedTime += 2000;

                    this.getRequestPlantingById(responsePlantingRequest.id)
                        .then((response: any) => {
                            const data = response.data;
                            WA.player.state.bed = data.bed;
                            if (data.bed.status !== "pending") {
                                clearInterval(intervalId);
                                resolve(data);
                            }

                            if (elapsedTime >= 10000) {
                                clearInterval(intervalId);
                                reject(new Error("Timeout reached without status change."));
                            }
                        })
                        .catch((error: any) => {
                            clearInterval(intervalId);
                            reject(error);
                        });
                }, 2000);
            }).catch(reject);
        });
    }

    getRequestPlantingById(requestId: string) {
        return this.apiManager.getRequestPlantingById(requestId)

    }
    //chichken
    createPetRequest(productId: number, quantity: number): Promise<any> {
        const bed = WA.player.state.bed as Bed
        if (!bed) {
            throw new Error("Couldn't find bed");
        }
        const requestPet = {
            bed_id: bed.id,
            product: {
                id: productId
            },
            quantity,
            action: "raising"
        } as RequestPet
        return new Promise((resolve, reject) => {
            this.apiManager.createRequestPet(requestPet).then((response: any) => {
                const responseFarminRequest = response.data as ResponseFarmingRequest;
                let elapsedTime = 0;
                const intervalId = setInterval(() => {
                    elapsedTime += 2000;
                    this.getPetRequestById(responseFarminRequest.id)
                        .then((response: any) => {
                            const data = response.data;
                            if (data.status !== "pending") {
                                clearInterval(intervalId);
                                resolve(data);
                            }
                            if (elapsedTime >= 10000) {
                                clearInterval(intervalId);
                                resolve(data);
                            }
                        })
                        .catch((error: any) => {
                            clearInterval(intervalId);
                            reject(error);
                        });
                }, 2000);
            }).catch(reject);
        });
    }
    getPetRequestById(requestId: string) {
        return this.apiManager.getRequestPetById(requestId)
    }
}