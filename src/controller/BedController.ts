import { BedArea, 
    Coordinate, 
    // MyTileDescriptor, 
    PlotArea } from "../entity/Other";
import { Area } from "../entity/Other";
import { createArea, createTilesDescriptor, deleteArea, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Utils";
import settings from "../settings/settings.json"
import tilesets from "../data/tilesets.json"
import FarmService from "../service/FarmService";
import RoomIframeService from "../service/RoomIframeService";
import { Bed } from "../entity/Bed";
import { ResponseFarmingRequest } from "../entity/Response";
import StaticData from "../data/StaticData";

const BED = settings.plot.bed
const TILE_SIZE = settings.tile_size
const TILESETS = tilesets["16x16"]
export default class BedController {
    private farmService: FarmService
    private roomIframeService: RoomIframeService
    constructor() {
        this.farmService = new FarmService()
        this.roomIframeService = new RoomIframeService()
        this.initVariable()
        this.subscribeVariableChange()
    }

    createBedsAreaInPlot(plotArea: PlotArea) {
        if (plotArea.plot.status == "new") {
            return
        }
        const totalRows = 3;
        const totalColumns = 2;
        const totalBeds = totalRows * totalColumns;
        for (let i = 0; i < totalBeds; i++) {
            const row = Math.floor(i / totalColumns);
            const col = i % totalColumns;
            const bedIndex = i + 1;
            const baseX = plotArea.area.coordinate.x + BED.relative_coordinate.x + ((BED.width + BED.margin_right) * col);
            const baseY = plotArea.area.coordinate.y + BED.relative_coordinate.y + ((BED.height + BED.margin_bottom) * row);
            const bedAreaY = (baseY * TILE_SIZE) + BED.area_relative.coordinate.y;
            const bedAreaX = (baseX * TILE_SIZE) + BED.area_relative.coordinate.x;
            const bedArea = {
                coordinate: { x: bedAreaX, y: bedAreaY },
                height: (BED.height * TILE_SIZE) + BED.area_relative.height,
                width: (BED.width * TILE_SIZE) + BED.area_relative.width,
            }
            const sortedBeds = this.sortBedsByNumber(plotArea.plot.bed) as Bed[];
            
            if (sortedBeds[i].status !== "new" && sortedBeds[i].bed_plant_history_id[0].status !== "prepare") {
                this.displayPlantedTrees(
                    { x: baseX, y: baseY },
                    sortedBeds[i].bed_plant_history_id[0].product.crop_id.id as string
                );
            }
            this.createBedArea({
                area: bedArea,
                index: bedIndex,
                name: `${plotArea.plot.plot_number}$$$${bedIndex}`,
                bed: sortedBeds[i],
            },
                {
                    x: baseX,
                    y: baseY
                }
            )

        }
    }

    private createBedArea(bedArea: BedArea, plantCoordinate?: Coordinate) {
        if (bedArea.bed.type != "bed")
            return
        let properties = new Map<string, string | number | boolean | undefined>();
        let listButton = ""
        createArea(
            bedArea.area,
            bedArea.name,
            properties
        );
        switch (bedArea.bed.status) {
            case "new":
                listButton += "planting,"
                break;
            case "prepare":
                this.bedPrepare(bedArea.area)
                break;
            // case "using":
            //     this.bedPrepare(bedArea)
            //     break;
            default:
                listButton += "watering,"
                // if (bedArea.bed.bed_plant_history_id.length > 0) {
                //     const tileset = bedArea.bed.bed_plant_history_id[0].product.crop_id.growth_stages[0].tileset as MyTileDescriptor;
                //     this.plantTree(bedArea.area.coordinate, tileset)

                // }

                break;
        }
        subscribeOnEnterArea(bedArea.name, () => {

            WA.player.state.bed = bedArea.bed;
            WA.player.state.bedName = bedArea.name;
            WA.player.state.bedArea = bedArea.area
            WA.player.state.bedIndex = bedArea.index;
            WA.player.state.plantArea = plantCoordinate
            this.roomIframeService.showListBedButton(listButton)
            console.log(WA.player.state.bed);

        });

        // Event: Leave Area
        subscribeOnLeaveArea(bedArea.name, () => {

            this.roomIframeService.closeListBedButton()
            WA.player.state.saveVariable("openConfirmPlant", false);
            WA.player.state.saveVariable("openListCrops", false)
            WA.player.state.saveVariable("openBedDetail", false);

            WA.player.state.bed = undefined;
            WA.player.state.bedArea = undefined
            WA.player.state.bedName = undefined;
            WA.player.state.bedIndex = undefined;
            WA.player.state.plantArea = undefined


        });
    }
    private reloadBedArea(bedArea: BedArea) {
        deleteArea(bedArea.name).then(() => {
            this.createBedArea(
                bedArea
            )
        })
    }
    private async displayPlantedTrees(coordinate: Coordinate, varietyId: string) {
        await StaticData.ensureInitialized();
        const cropId = StaticData.getVarietyAndCrop().get(varietyId) as string
        const tileset = StaticData.getCropTileSets().get(cropId)
        console.log(cropId);
        console.log(tileset);
        
        
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
    // private plantTree(coordinate: Coordinate, tilesets: MyTileDescriptor) {
    //     const baseX = (coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE;
    //     const baseY = (coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE;
    //     tilesets
    //     for (let row = 0; row < BED.height; row++) {
    //         const currentLayer = `beds/bed${5 - row}`;
    //         for (let col = 0; col < BED.width; col++) {
    //             const x = coordinate.x + col;
    //             const baseY = coordinate.y + row;
    //             WA.room.setTiles(createTilesDescriptor(
    //                 {
    //                     x: baseX,
    //                     y: baseY
    //                 },
    //                 tilesets,
    //                 currentLayer))
    //             // tilesets.forEach((tile: any, index: any) => {
    //             //     const y = index === 0 ? baseY : baseY - index;

    //             //     const treeTile = {
    //             //         x: x,
    //             //         y: y,
    //             //         tile: tile,
    //             //         layer: "beds/" + currentLayer
    //             //     };

    //             //     WA.room.setTiles([treeTile]);
    //             // });
    //         }
    //     }
    // }
    private bedPrepare(bedArea: Area) {
        const layer = "below/below1";
        const tileDescriptors = [
            TILESETS.plow.plow1,
            TILESETS.plow.plow2,
            TILESETS.plow.plow3,
        ];
        let remainingTileDescriptors = [...tileDescriptors];
        for (let index = 0; index < tileDescriptors.length; index++) {
            const randomIndex = Math.floor(Math.random() * remainingTileDescriptors.length);
            const randomTileDescriptor = remainingTileDescriptors[randomIndex];
            remainingTileDescriptors.splice(randomIndex, 1);
            WA.room.setTiles(createTilesDescriptor(
                {
                    x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE + randomTileDescriptor.relative_coordinate.x),
                    y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE + randomTileDescriptor.relative_coordinate.y),
                },
                randomTileDescriptor,
                layer
            ));
            if (remainingTileDescriptors.length === 0) break;
        }
    }

    private bedWatering(bedArea: Area) {
        const layer = "below/below1";
        const tileDescriptors = [
            TILESETS.watering.watering1,
            TILESETS.watering.watering2,
            TILESETS.watering.watering3,
        ];
        let remainingTileDescriptors = [...tileDescriptors];
        for (let index = 0; index < tileDescriptors.length; index++) {
            const randomIndex = Math.floor(Math.random() * remainingTileDescriptors.length);
            const randomTileDescriptor = remainingTileDescriptors[randomIndex];
            remainingTileDescriptors.splice(randomIndex, 1);
            console.log(createTilesDescriptor(
                {
                    x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE + randomTileDescriptor.relative_coordinate.x),
                    y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE + randomTileDescriptor.relative_coordinate.y),
                },
                randomTileDescriptor,
                layer
            ));

            WA.room.setTiles(createTilesDescriptor(
                {
                    x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE + randomTileDescriptor.relative_coordinate.x),
                    y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE + randomTileDescriptor.relative_coordinate.y),
                },
                randomTileDescriptor,
                layer
            ));
            if (remainingTileDescriptors.length === 0) break;
        }
    }
    private sortBedsByNumber(beds: Bed[]): Bed[] {
        return beds.sort((a, b) => a.bed_number - b.bed_number);
    }
    private initVariable() {
        WA.player.state.saveVariable("confirmPlant", false);
        WA.player.state.saveVariable("confirmWatering", false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("confirmPlant").subscribe((e) => {
            if (e) {
                if (!WA.player.state.productId
                ) {
                    WA.player.state.saveVariable('confirmPlant', false)
                    return;
                }
                const name = WA.player.state.bedName as string
                const area = WA.player.state.bedArea as Area
                const bedIndex = WA.player.state.bedIndex as number
                this.farmService.createPlantingRequest(WA.player.state.productId as number, (WA.player.state.bed as Bed).id).then((response: any) => {
                    this.reloadBedArea({
                        name: name,
                        area: area,
                        index: bedIndex,
                        bed: response.bed
                    })
                })
                WA.player.state.saveVariable('confirmPlant', false)
            }
        })
        WA.player.state.onVariableChange("confirmWatering").subscribe((e) => {
            if (e) {
                if (!WA.player.state.bed) {
                    WA.player.state.saveVariable('confirmWatering', false)
                    return;
                }
                const bedName = WA.player.state.bedName as string
                const bedArea = WA.player.state.bedArea as Area
                const index = WA.player.state.bedIndex as number
                this.farmService.createWateringRequest((WA.player.state.bed as Bed).id).then((response: ResponseFarmingRequest) => {
                    if (response.status == "in_progress") {
                        this.bedWatering(bedArea)
                        setTimeout(() => {
                            this.createBedArea({
                                area: bedArea,
                                bed: response.bed,
                                name: bedName,
                                index: index
                            })
                        }, 20 * 60 * 1000);
                    }

                })
                WA.player.state.saveVariable('confirmWatering', false)
            }
        })
    }
}
