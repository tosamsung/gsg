/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import LandController from "./controller/LandController";
const landController = new LandController()

WA.onInit().then(async () => {
    landController.createLandAreas()

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
}).catch(e => console.error(e));


export { };
