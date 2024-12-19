import ApiManager from "../api/ApiManager";
// import { Bed } from "../entity/Bed";
import { RequestFeedingPet, RequestPet, RequestPlanting, RequestWatering } from "../entity/Request";
import { ResponseFarmingRequest } from "../entity/Response";

export default class FarmService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }
    //bed
    createPlantingRequest(productId: number, bedId: string): Promise<any> {
        if (!bedId) {
            throw new Error("Couldn't find bed");
        }

        const requestFarming = {
            bed_id: bedId,
            product: {
                id: productId,
            },
            action: "planting",
        } as RequestPlanting;

        return new Promise((resolve, reject) => {
            this.apiManager.createRequestPlanting(requestFarming).then((response: any) => {
                const responsePlantingRequest = response.data as ResponseFarmingRequest;

                let elapsedTime = 0;
                const intervalId = setInterval(() => {
                    elapsedTime += 2000;

                    this.getBedRequestById(responsePlantingRequest.id)
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
    createWateringRequest(bedId: string): Promise<any> {
        if (!bedId) {
            throw new Error("Couldn't find bed");
        }
        const requestFarming = {
            bed_id: bedId,
            action: "watering",
        } as RequestWatering;

        return new Promise((resolve, reject) => {
            this.apiManager.createRequestWatering(requestFarming).then((response: any) => {
                const responsePlantingRequest = response.data as ResponseFarmingRequest;
                this.getBedRequestById(responsePlantingRequest.id)
                    .then((response: any) => {
                        const data = response.data as ResponseFarmingRequest;
                        if (data.status == "in_progress") {
                            resolve(data);
                        }
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            }).catch(reject);
        });
    }
    getBedRequestById(requestId: string) {
        return this.apiManager.getBedRequestById(requestId)
    }
    //chichken
    createPetRequest(productId: number, quantity: number, bedId: string): Promise<any> {
        if (!bedId) {
            throw new Error("Couldn't find bed");
        }
        const requestPet = {
            bed_id: bedId,
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
                                WA.player.state.bed = data.bed;
                                clearInterval(intervalId);
                                resolve(data);
                            }
                            if (elapsedTime >= 10000) {
                                WA.player.state.bed = data.bed;
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
    createFeedingRequest(bedId: string): Promise<any> {
        if (!bedId) {
            throw new Error("Couldn't find bed");
        }
        const requestPet = {
            bed_id: bedId,
            action: "feeding"
        } as RequestFeedingPet
        return new Promise((resolve, reject) => {
            this.apiManager.createRequestFeeding(requestPet).then((response: any) => {
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