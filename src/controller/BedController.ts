import { Coordinate } from "../entity/Other";
import { Area } from "../entity/Other";
import { createArea, deleteArea, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Helper";
import settings from "../settings/settings.json"
import PlotService from "../service/PlotService";
import CropVarietyService from "../service/CropVarietyService"
import Bed from "../entity/Bed";
import BedService from "../service/BedService";
import StaticData from "../data/StaticData";
import { ButtonService } from "../service/ButtonService";
import { Plot } from "../entity/Plot";

const BED = settings.plot.bed
const plotService = new PlotService()
const cropVarietyService = new CropVarietyService()
const bedService = new BedService()

export default class BedController {
    private buttonService: ButtonService
    constructor(buttonService: ButtonService) {
        this.buttonService = buttonService
        this.initVariable()
        this.subscribeVariableChange()
    }

    createBedAreaInPlot(coordinate: Coordinate, plot: Plot, landName: string) {
        const totalRows = 3;
        const totalColumns = 2;
        const totalBeds = totalRows * totalColumns;

        for (let i = 0; i < totalBeds; i++) {
            const row = Math.floor(i / totalColumns);
            const col = i % totalColumns;
            const bedIndex = i + 1;

            const baseX = coordinate.x + BED.relative_coordinate.x + ((BED.width + BED.margin_right) * col);
            const baseY = coordinate.y + BED.relative_coordinate.y + ((BED.height + BED.margin_bottom) * row);
            const plantAreaY = (baseY * 32) - 5;
            const plantAreaX = (baseX * 32) - 15;
            const bedArea = {
                coordinate: { x: plantAreaX, y: plantAreaY },
                height: (BED.height * 32) + 30,
                width: (BED.width * 32) + 30,
            }

            const bedToPlant = plot.bed.find((b: any) => b.bed_number === bedIndex) as Bed;
            if (bedToPlant) {
                this.displayPlantedTrees(
                    { x: baseX, y: baseY },
                    bedToPlant.crop_variety_id as string
                );
            }
            this.createBedArea(
                bedArea,
                bedIndex,
                `${landName}$$$${plot.plot_number}$$$${bedIndex}`,
                bedToPlant
            )
        }
    }
    createEmptyBedAreaInPlot(coordinate: Coordinate, plot: Plot, landName: string) {
        const totalRows = 3;
        const totalColumns = 2;
        const totalBeds = totalRows * totalColumns;

        for (let i = 0; i < totalBeds; i++) {
            const row = Math.floor(i / totalColumns);
            const col = i % totalColumns;
            const bedIndex = i + 1;

            const baseX = coordinate.x + BED.relative_coordinate.x + ((BED.width + BED.margin_right) * col);
            const baseY = coordinate.y + BED.relative_coordinate.y + ((BED.height + BED.margin_bottom) * row);
            const plantAreaY = (baseY * 32) - 5;
            const plantAreaX = (baseX * 32) - 15;
            const bedArea = {
                coordinate: { x: plantAreaX, y: plantAreaY },
                height: (BED.height * 32) + 30,
                width: (BED.width * 32) + 30,
            }

            const emptyBed = {} as Bed;
            this.createBedArea(
                bedArea,
                bedIndex,
                `${landName}$$$${plot.plot_number}$$$${bedIndex}`,
                emptyBed
            )
        }
    }
    private createBedArea(bedArea: Area, bedIndex: number, bedName: string, bed: Bed) {
        let properties = new Map<string, string | number | boolean | undefined>();
        createArea(
            bedArea,
            bedName,
            properties
        );
        // Event: Enter Area
        subscribeOnEnterArea(bedName, () => {
            if (bed) {
                this.buttonService.openButtonView(`popup${bedIndex}$$$plot${WA.player.state.plotIndex}`)
            }
            else {
                this.buttonService.openButtonPlant(`popup${bedIndex}$$$plot${WA.player.state.plotIndex}`)
            }
            WA.player.state.bed = bed;
            WA.player.state.bedName = bedName;
            WA.player.state.bedArea = bedArea
            WA.player.state.plantArea = {
                x: (bedArea.coordinate.x + 15) / 32,
                y: (bedArea.coordinate.y + 5) / 32
            }
            WA.player.state.bedIndex = bedIndex;
        });

        // Event: Leave Area
        subscribeOnLeaveArea(bedName, () => {
            if (bed) {
                this.buttonService.closeButtonView()
                WA.player.state.saveVariable("openBedDetail", false);

            } else {
                this.buttonService.closeButtonPlant()
                WA.player.state.saveVariable("openConfirmPlant", false);
                WA.player.state.saveVariable("openListCrops", false)

            }
            WA.player.state.bed = undefined;
            WA.player.state.bedArea = undefined
            WA.player.state.bedName = undefined;
            WA.player.state.plantArea = undefined;
            WA.player.state.bedIndex = undefined;

        });
    }
    private reloadBedArea() {
        this.buttonService.closeButtonPlant()
        deleteArea(WA.player.state.bedName as string).then(() => {
            this.createBedArea(
                WA.player.state.bedArea as Area,
                WA.player.state.bedIndex as number,
                WA.player.state.bedName as string,
                WA.player.state.bed as Bed
            )
            this.buttonService.openButtonView(`popup${WA.player.state.bedIndex}$$$plot${WA.player.state.plotIndex}`)

        })

    }
    private async displayPlantedTrees(coordinate: Coordinate, varietyId: string) {
        await StaticData.ensureInitialized();
        const cropId = StaticData.getVarietyAndCrop().get(varietyId) as string
        const tileset = StaticData.getCropTileSets().get(cropId)
        this.plantTree(coordinate, [tileset._1[0]])
    }
    private plantTree(coordinate: Coordinate, tilesets: number[]) {

        for (let row = 0; row < BED.height; row++) {
            const currentLayer = `bed${5 - row}`;

            for (let col = 0; col < BED.width; col++) {
                const x = coordinate.x + col;
                const baseY = coordinate.y + row;

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

        return Promise.all([
            plotService.getPlotByIdPrunedData(plotNumber),
            cropVarietyService.getCropVarietyById(WA.player.state.varietyId as string)
        ]).then(async ([plotResponse, cropVarietyResponse]: any) => {
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

                return await bedService.createBed(bed)

            } else {
                return null
            }
        }).catch(error => {
            console.error("Error in Promise.all:", error);
        });
    }
    private initVariable() {
        WA.player.state.saveVariable("confirmPlant", false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("confirmPlant").subscribe((e) => {
            if (e) {
                if (!WA.player.state.varietyId
                    || !WA.player.state.plantArea
                    || !WA.player.state.cropTileset
                    || !WA.player.state.plot
                    || !WA.player.state.bedIndex
                ) {
                    WA.player.state.saveVariable('confirmPlant', false)
                    return;
                }
                this.createBed((WA.player.state.plot as Plot).id, WA.player.state.bedIndex as any).then((bedResponse: any) => {
                    WA.player.state.bed = bedResponse.data
                    this.reloadBedArea()
                    this.plantTree(
                        WA.player.state.plantArea as Coordinate
                        , (WA.player.state.cropTileset as any)._1
                    )

                })
                WA.player.state.saveVariable('confirmPlant', false)
            }
        })
    }
}
