/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import PlotController from "./controller/PlotController";
import FieldController from "./controller/FieldController";
import settings from "./settings/settings.json"
import { EmbedWebsiteService } from "./service/EmbedWebsiteService";
import StaticData from "./data/StaticData";
import { checkDeviceScreen } from "./helper/Helper";
import PlayerController from "./controller/PlayerController";
import { ButtonService } from "./service/ButtonService";

const embedWebsiteService = new EmbedWebsiteService()
const buttonService=new ButtonService()
const plotController = new PlotController()
const fieldController = new FieldController(embedWebsiteService,buttonService)
const playerController=new PlayerController()
const PLOT = settings.plot

WA.onInit().then(async () => {
    checkDeviceScreen()
    StaticData
    playerController.subscribeOnPlayerMove()
    plotController.createPlotInLand().then((response: any) => {
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
                fieldController.createPlantAreaInPlot(
                    { x: new_x, y: new_y },
                    matchedPlot,
                    currentPlotNumber,
                    "land" + response.landNumber
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