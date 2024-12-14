import { Coordinate, MyTileDescriptor, PlotArea } from "../entity/Other";
import { Area } from "../entity/Other";
import { createArea, createTilesDescriptor, deleteArea, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Helper";
import settings from "../settings/settings.json"
import tilesets from "../data/tilesets.json"
import StaticData from "../data/StaticData";
import FarmService from "../service/FarmService";
import RoomIframeService from "../service/RoomIframeService";
import { Bed } from "../entity/Bed";

const BED = settings.plot.bed
const TILE_SIZE = settings.tile_size
const TILESETS = tilesets
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
            if (plotArea.plot.bed && plotArea.plot.bed.length > 0) {
                const sortedBeds = this.sortBedsByNumber(plotArea.plot.bed);

                if (sortedBeds[i].status !== "new" && sortedBeds[i].status !== "prepare") {
                    this.displayPlantedTrees(
                        { x: baseX, y: baseY },
                        sortedBeds[i].crop_variety_id as string
                    );
                }
                this.createBedArea(
                    bedArea,
                    bedIndex,
                    `${plotArea.plot.plot_number}$$$${bedIndex}`,
                    sortedBeds[i]
                )
            }
        }
    }

    private createBedArea(bedArea: Area, bedIndex: number, bedName: string, bed: Bed) {
        let properties = new Map<string, string | number | boolean | undefined>();
        createArea(
            bedArea,
            bedName,
            properties
        );
        switch (bed.status) {
            case "prepare":
                this.bedPrepare(bedArea)
                break;
            // case "using":
            //     this.bedPrepare(bedArea)
            //     break;
            default:
                break;
        }
        subscribeOnEnterArea(bedName, () => {
            WA.player.state.bed = bed;
            WA.player.state.bedName = bedName;
            WA.player.state.bedArea = bedArea
            WA.player.state.plantArea = {
                x: (bedArea.coordinate.x + BED.area_relative.coordinate.x) / TILE_SIZE,
                y: (bedArea.coordinate.y + BED.area_relative.coordinate.y) / TILE_SIZE
            }
            WA.player.state.bedIndex = bedIndex;
            this.roomIframeService.showListBedButton()

        });

        // Event: Leave Area
        subscribeOnLeaveArea(bedName, () => {

            this.roomIframeService.closeListBedButton()
            WA.player.state.saveVariable("openConfirmPlant", false);
            WA.player.state.saveVariable("openListCrops", false)
            WA.player.state.saveVariable("openBedDetail", false);

            WA.player.state.bed = undefined;
            WA.player.state.bedArea = undefined
            WA.player.state.bedName = undefined;
            WA.player.state.plantArea = undefined;
            WA.player.state.bedIndex = undefined;

        });
    }
    private reloadBedArea() {
        deleteArea(WA.player.state.bedName as string).then(() => {
            this.createBedArea(
                WA.player.state.bedArea as Area,
                WA.player.state.bedIndex as number,
                WA.player.state.bedName as string,
                WA.player.state.bed as Bed
            )

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
    private bedPrepare(bedArea: Area) {
        const layer = "below/below"
        const areaPlow1 = {
            x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE),
            y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE)
        }
        const areaPlow2 = {
            x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE + 5),
            y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE + 1)
        }
        const areaPlow3 = {
            x: Math.floor((bedArea.coordinate.x - BED.area_relative.coordinate.x) / TILE_SIZE + 2),
            y: Math.floor((bedArea.coordinate.y - BED.area_relative.coordinate.y) / TILE_SIZE + 2)
        }
        const plow1TileDescriptor = {
            cols: TILESETS.plow.width,
            rows: TILESETS.plow.height,
            tilesets: TILESETS.plow.plow1
        } as MyTileDescriptor
        const plow2TileDescriptor = {
            cols: TILESETS.plow.width,
            rows: TILESETS.plow.height,
            tilesets: TILESETS.plow.plow2
        } as MyTileDescriptor
        const plow3TileDescriptor = {
            cols: TILESETS.plow.width,
            rows: TILESETS.plow.height,
            tilesets: TILESETS.plow.plow3
        } as MyTileDescriptor
        WA.room.setTiles(createTilesDescriptor(areaPlow1, plow1TileDescriptor, layer))
        WA.room.setTiles(createTilesDescriptor(areaPlow2, plow2TileDescriptor, layer))
        WA.room.setTiles(createTilesDescriptor(areaPlow3, plow3TileDescriptor, layer))

    }
    private sortBedsByNumber(beds: Bed[]): Bed[] {
        return beds.sort((a, b) => a.bed_number - b.bed_number);
    }
    private initVariable() {
        WA.player.state.saveVariable("confirmPlant", false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("confirmPlant").subscribe((e) => {            
            if (e) {
                if (!WA.player.state.productId
                    || !WA.player.state.plantArea
                ) {
                    WA.player.state.saveVariable('confirmPlant', false)
                    return;
                }
                this.farmService.createPlantingRequest(WA.player.state.productId as number).then(() => {
                    this.reloadBedArea()
                })
                WA.player.state.saveVariable('confirmPlant', false)
            }
        })
    }
}
