/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import PlotController from "./controller/PlotController";
import BedController from "./controller/BedController";
import "./settings/DefaultSetup"
import { getLandNumberFromUrl } from "./helper/Utils";
import { PlotArea } from "./entity/Other";
import CageController from "./controller/CageController";
const bedController = new BedController()
const chickenController = new CageController()

const plotController = new PlotController(bedController, chickenController)

WA.onInit().then(async () => {
    const landNumber = getLandNumberFromUrl(WA.room.mapURL) as number
    WA.player.state.landName = "land" + landNumber    
    plotController.createPlotsInLand(landNumber).then((response: PlotArea[]) => {
        for (let index = 0; index < response.length; index++) {
            bedController.createBedsAreaInPlot(
                response[index]
            );
            chickenController.createCageArea(
                response[index]
            )
        }
    });


    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
}).catch(e => console.error(e));



export { };