import { Coordinate } from "../entity/Coordinate";
import { Area } from "../entity/Area";
import { createArea, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Helper";
import settings from "../settings/settings.json"
import { extractNumberFromString } from "../helper/Helper";
import PlotService from "../service/PlotService";
import CropVarietyService from "../service/CropVarietyService"
import Bed from "../entity/Bed";
import BedService from "../service/BedService";
import { EmbedWebsiteService } from "../service/EmbedWebsiteService";
import StaticData from "../data/StaticData";
import { ButtonService } from "../service/ButtonService";
import { Plot } from "../entity/Plot";

const FIELD = settings.plot.field

const plotService = new PlotService()
const cropVarietyService = new CropVarietyService()
const bedService = new BedService()

export default class FieldController {
    buttonService: ButtonService
    embedWebsiteService: EmbedWebsiteService
    constructor(embedWebsiteService: EmbedWebsiteService, buttonService: ButtonService) {
        this.embedWebsiteService = embedWebsiteService
        this.buttonService = buttonService
        this.subscribeConfirmPlantVariableChange()
    }

    createPlantAreaInPlot(coordinate: Coordinate, plot: Plot, plotIndex: any, landName: string) {
        const landNumber = extractNumberFromString(landName) as number
        let properties = new Map<string, string | number | boolean | undefined>();
        const totalRows = 3;
        const totalColumns = 2;
        const totalBeds = totalRows * totalColumns;

        for (let i = 0; i < totalBeds; i++) {
            const row = Math.floor(i / totalColumns);
            const col = i % totalColumns;
            const bedIndex = i + 1;

            const baseX = coordinate.x + FIELD.relative_coordinate.x + ((FIELD.width + FIELD.margin_right) * col);
            const baseY = coordinate.y + FIELD.relative_coordinate.y + ((FIELD.height + FIELD.margin_bottom) * row);
            const area_y = (baseY * 32) - 5;

            const plotCoordinate = { x: baseX, y: baseY };
            const bedCoordinate = { x: baseX, y: baseY };

            // Create plant area
            createArea(
                {
                    coordinate: { x: (baseX * 32) - 15, y: area_y },
                    height: (FIELD.height * 32) + 30,
                    width: (FIELD.width * 32) + 30,
                },
                `${landName}$$$${plot.plot_number}$$$${bedIndex}`,
                properties
            );
            if (plot.bed) {
                const bedToPlant = plot.bed.find((b: any) => b.bed_number === bedIndex);
                if (bedToPlant) {
                    this.displayPlantedTrees(
                        {
                            coordinate: plotCoordinate,
                            height: 5,
                            width: 8,
                        },
                        bedToPlant.crop_variety_id as string
                    );
                }
                // Event: Enter Area
                subscribeOnEnterArea(`${landName}$$$${plot.plot_number}$$$${bedIndex}`, () => {
                    if (bedToPlant) {
                        WA.player.state.bedId = bedToPlant.id;
                        this.buttonService.openButtonView(`popup${bedIndex}$$$plot${plotIndex}`)
                    } 
                    else {
                        this.buttonService.openButtonPlant(`popup${bedIndex}$$$plot${plotIndex}`)
                    }
                    WA.player.state.plantArea = {
                        coordinate: bedCoordinate,
                        height: 5,
                        width: 8,
                    };
                    WA.player.state.plotId = plot.id;
                    WA.player.state.bedInput_landNumber = landNumber;
                    WA.player.state.bedInput_bedIndex = bedIndex;
                });

                // Event: Leave Area
                subscribeOnLeaveArea(`${landName}$$$${plot.plot_number}$$$${bedIndex}`, () => {
                    if (bedToPlant) {
                        this.buttonService.closeButtonView()
                        WA.player.state.saveVariable("openBedDetail", false);

                    }else {
                        this.buttonService.closeButtonPlant()
                        WA.player.state.saveVariable("openConfirmPlant", false);
                        WA.player.state.saveVariable("openListCrops", false)

                    }
                    WA.player.state.plantArea = undefined;
                    WA.player.state.plotId = undefined;
                    WA.player.state.bedInput_landNumber = undefined;
                    WA.player.state.bedInput_bedIndex = undefined;

                });
            }
        }
    }

    private async displayPlantedTrees(area: Area, varietyId: string) {
        await StaticData.ensureInitialized();
        const cropId = StaticData.getVarietyAndCrop().get(varietyId) as string
        const tileset = StaticData.getCropTileSets().get(cropId)

        this.eventPlantTree(area, [tileset._1[0]])

    }
    private eventPlantTree(area: Area, tilesets: number[]) {

        for (let row = 0; row < area.height; row++) {
            const currentLayer = `bed${5 - row}`;

            for (let col = 0; col < area.width; col++) {
                const x = area.coordinate.x + col;
                const baseY = area.coordinate.y + row;

                tilesets.forEach((tile: any, index: any) => {
                    const y = index === 0 ? baseY : baseY - index;

                    const treeTile = {
                        x: x,
                        y: y,
                        tile: tile,
                        layer: "beds/" + currentLayer
                    };

                    WA.room.setTiles([treeTile]);
                });
            }
        }
    }
    private createBed(plotNumber: string, bedIndex: number) {
        let plotData: any = null;
        let cropVarietyData: any = null;

        Promise.all([
            plotService.getPlotByIdPrunedData(plotNumber),
            cropVarietyService.getCropVarietyById(WA.player.state.varietyId as string)
        ]).then(([plotResponse, cropVarietyResponse]: any) => {
            plotData = plotResponse.data;
            cropVarietyData = cropVarietyResponse.data;
            if (cropVarietyData && plotData && plotData.length > 0) {
                const bed: Bed = {
                    expected_harvest_yield: 500,
                    flowering_date: new Date('2024-11-26'),
                    crop_variety: cropVarietyData,
                    plot: plotData,
                    length: 10,
                    harvest_date: new Date('2024-12-26'),
                    planting_date: new Date(),
                    width: 5,
                    status: "using",
                    bed_number: bedIndex
                };

                bedService.createBed(bed)
                    .then(() => {
                        console.log("Plant success");
                    })
                    .catch(error => {
                        console.error("Error creating bed:", error);
                    });
            } else {
                console.warn("Condition not satisfied for creating bed.");
            }
        }).catch(error => {
            console.error("Error in Promise.all:", error);
        });
    }
    subscribeConfirmPlantVariableChange() {
        WA.player.state.onVariableChange("confirmPlant").subscribe((e) => {
            if (e) {
                if (!WA.player.state.varietyId
                    || !WA.player.state.plantArea
                    || !WA.player.state.cropTileset
                    || !WA.player.state.plotId
                    || !WA.player.state.bedInput_landNumber
                    || !WA.player.state.bedInput_bedIndex) {
                    return;
                }
                this.eventPlantTree(
                    WA.player.state.plantArea as Area
                    , (WA.player.state.cropTileset as any)._1
                )
                this.createBed(WA.player.state.plotId as any
                    , WA.player.state.bedInput_bedIndex as any)
            }

        })
    }
}
