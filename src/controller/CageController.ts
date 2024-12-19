import { Area, Coordinate, MyTileDescriptor, PlotArea } from "../entity/Other";
import { createArea, createTilesDescriptor, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Utils";
import settings from "../settings/settings.json"
import FarmService from "../service/FarmService";
import tilesets from "../data/tilesets.json"
import { cageButton } from "../helper/ui/IframeRoom";
import { Bed, BedHistory } from "../entity/Bed";
import { Product } from "../entity/Product";
import { ResponseFarmingRequest } from "../entity/Response";

const CAGE = settings.plot.cage
const TILESETS = tilesets["16x16"]
const TILE_SIZE = settings.tile_size

export default class CageController {
    private farmService: FarmService
    constructor() {
        this.farmService = new FarmService()
        this.initVariable()
        this.subscribeVariableChange()
    }

    createCageArea(plotArea: PlotArea) {
        if (plotArea.plot.status == "new") {
            return
        }
        const cageBeds = plotArea.plot.bed.filter(bed => bed.type === "cage") as Bed[];
        const numberOfChicken = this.getAllPets(cageBeds[0])

        let properties = new Map<string, string | number | boolean | undefined>();
        const tileCageCoordinate = {
            x: (plotArea.area.coordinate.x + CAGE.relative_coordinate.x),
            y: (plotArea.area.coordinate.y + CAGE.relative_coordinate.y)
        } as Coordinate

        const cageArea = {
            coordinate: {
                x: (plotArea.area.coordinate.x + CAGE.relative_coordinate.x) * TILE_SIZE - 8,
                y: (plotArea.area.coordinate.y + CAGE.relative_coordinate.y) * TILE_SIZE - 5
            },
            width: (CAGE.width) * TILE_SIZE + 18,
            height: (CAGE.height) * TILE_SIZE + 25
        } as Area
        //load pet
        // if (numberOfChicken)
        this.loadChickens(tileCageCoordinate, cageBeds[0].bed_plant_history_id)

        //create area
        createArea(
            cageArea,
            `chickencoop$$$plot` + plotArea.index,
            properties
        );
        subscribeOnEnterArea(`chickencoop$$$plot` + plotArea.index, () => {
            WA.player.state.cageCoordinate = tileCageCoordinate
            WA.player.state.bed = cageBeds[0]
            WA.room.website.create(cageButton(numberOfChicken))
        });
        subscribeOnLeaveArea(`chickencoop$$$plot` + plotArea.index, () => {
            WA.player.state.cageCoordinate = undefined
            WA.player.state.bed = undefined
            WA.room.website.delete("cageButton")
            WA.player.state.saveVariable("openListChickens", false)
        });
    }
    private getAllPets(bed: Bed): number {
        if (bed.bed_plant_history_id && bed.bed_plant_history_id.length <= 0)
            return 0
        let numberOfChicken = 0
        bed.bed_plant_history_id.map((history: BedHistory) => {
            numberOfChicken += history.quantity
        })
        return numberOfChicken
    }
    private loadChickens(coordinate: Coordinate, bedHistory: BedHistory[]) {
        if (bedHistory.length == 0)
            return
        const layer = "below/below1";
        const maxCols = CAGE.width - 2;
        const maxRows = CAGE.height - 2;
        let currentX = coordinate.x + 1;
        let currentY = coordinate.y + 1;
        bedHistory.forEach((history) => {
            const tileset = history.product_type === "egg" ? TILESETS.chicken.egg : TILESETS.chicken.meat;
            const chickenRun1TileDescriptor = tileset.run_1 as MyTileDescriptor
            const chickenRun2TileDescriptor = tileset.run_2 as MyTileDescriptor
            for (let i = 0; i < history.quantity; i++) {
                if (currentX + 2 > coordinate.x + maxCols) {
                    currentX = coordinate.x + 1;
                    currentY += 1;
                }
                if (currentY > coordinate.y + maxRows) {
                    return;
                }
                const randomTileDescriptor =
                    Math.random() < 0.5
                        ? chickenRun1TileDescriptor
                        : chickenRun2TileDescriptor;
                WA.room.setTiles(
                    createTilesDescriptor(
                        { x: currentX, y: currentY },
                        randomTileDescriptor,
                        layer
                    )
                );

                currentX += 2; // Di chuyển sang ô kế tiếp
            }
        });
    }

    private loadChickensEating(coordinate: Coordinate, bedHistory: BedHistory[]) {
        if (bedHistory.length == 0) return;

        const layer = "below/below1";
        const maxCols = CAGE.width - 2;
        const maxRows = CAGE.height - 2;

        let currentX = coordinate.x + 1;
        let currentY = coordinate.y + 1;

        bedHistory.forEach((history) => {
            const tileset = history.product_type === "egg" ? TILESETS.chicken.egg : TILESETS.chicken.meat;
            const tileDescriptors = [
                tileset.eat_1,
                tileset.eat_2,
                tileset.eat_3,
                tileset.eat_4,
            ] as MyTileDescriptor[];

            for (let i = 0; i < history.quantity; i++) {
                if (currentX + 2 > coordinate.x + maxCols) {
                    currentX = coordinate.x + 1;
                    currentY += 1;
                }
                if (currentY > coordinate.y + maxRows) {
                    return;
                }
                const randomTileDescriptor = tileDescriptors[Math.floor(Math.random() * tileDescriptors.length)];
                WA.room.setTiles(
                    createTilesDescriptor(
                        { x: currentX, y: currentY },
                        randomTileDescriptor,
                        layer
                    )
                );

                currentX += 2;
            }
        });
    }


    private initVariable() {
        WA.player.state.saveVariable("confirmBuyChicken", false);
        WA.player.state.saveVariable("confirmFeedChicken", false);
        WA.player.state.saveVariable("quantity", 0);

    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("quantity").subscribe((e) => {
            if (e as number > 0) {
                WA.room.website.delete("cageButton").then(()=>{
                    WA.room.website.create(cageButton(1))
                })
            }
        })
        WA.player.state.onVariableChange("confirmBuyChicken").subscribe((e) => {
            if (e) {
                if (!WA.player.state.product) {
                    WA.player.state.saveVariable('confirmBuyChicken', false)
                    return
                }
                const product = WA.player.state.product as Product
                const cageCoordinate = WA.player.state.cageCoordinate as Coordinate

                const bed = WA.player.state.bed as Bed
                let flag = false
                if (bed.bed_plant_history_id.length == 0)
                    flag = true

                this.farmService.createPetRequest(product.id, product.quantity, (WA.player.state.bed as Bed).id).then((response: ResponseFarmingRequest) => {
                    if (response.status == "pending") {

                        const bed = response.bed as Bed
                        if (flag) {
                            WA.player.state.saveVariable('quantity', 1)

                        }
                        // console.log(bed.bed_plant_history_id);
                        WA.player.state.bed = bed
                        this.loadChickens(cageCoordinate, bed.bed_plant_history_id)

                    }
                }).catch(() => {
                    WA.player.state.saveVariable('confirmBuyChicken', false)
                })
                WA.player.state.saveVariable('confirmBuyChicken', false)

            }
        })
        WA.player.state.onVariableChange("confirmFeedChicken").subscribe((e) => {
            console.log(WA.player.state.bed);

            if (e) {
                if (!WA.player.state.bed) {
                    WA.player.state.saveVariable('confirmFeedChicken', false)
                    return
                }
                const cageCoordinate = WA.player.state.cageCoordinate as Coordinate;
                const bed = WA.player.state.bed as Bed
                this.farmService.createFeedingRequest((WA.player.state.bed as Bed).id).then(() => {
                    this.loadChickensEating(cageCoordinate, bed.bed_plant_history_id);
                    setTimeout(() => {
                        this.loadChickens(cageCoordinate, bed.bed_plant_history_id);
                    }, 7000);
                });

                WA.player.state.saveVariable('confirmBuyChicken', false)
            }
        })
    }
}
