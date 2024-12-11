/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import PlotController from "./controller/PlotController";
import BedController from "./controller/BedController";
import settings from "./settings/settings.json"
import { ButtonService } from "./service/ButtonService";
import "./settings/DefaultSetup"
import "./service/IframeService"
import { getLandNumberFromUrl } from "./helper/Helper";
const buttonService = new ButtonService()
const bedController = new BedController(buttonService)
const plotController = new PlotController(bedController)
const PLOT = settings.plot

WA.onInit().then(async () => {
    const landNumber = getLandNumberFromUrl(WA.room.mapURL) as number
    WA.player.state.landName = "land" + landNumber
    WA.room.website.create(()=>{
        
    })
    // BedController.
    plotController.createPlotsInLand(landNumber).then((response: any) => {
        const plots = response.data;
        const totalRows = 6;
        const totalColumns = 2;
        const plotsPerRow = totalColumns;
        const totalPlots = totalRows * totalColumns;

        let currentPlotNumber = 1;

        for (let i = 0; i < totalPlots; i++) {
            const row = Math.floor(i / plotsPerRow);
            const col = i % plotsPerRow;

            const new_y = PLOT.start_coordinate.y + (PLOT.height + PLOT.margin_bottom) * row;
            const new_x = PLOT.start_coordinate.x + (PLOT.width + PLOT.margin_right) * col;
            const matchedPlot = plots.find(
                (plot: any) => plot.row === row + 1 && plot.column === col + 1
            );

            if (matchedPlot && matchedPlot.status === "using") {
                bedController.createBedAreaInPlot(
                    { x: new_x, y: new_y },
                    matchedPlot,
                    WA.player.state.landName as string
                );
            }

            currentPlotNumber++;
        }
    });


    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
}).catch(e => console.error(e));



export { };