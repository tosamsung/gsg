import { Area, Coordinate, MyTileDescriptor, PlotArea } from "../entity/Other";
import { createArea, createTilesDescriptor, subscribeOnEnterArea, subscribeOnLeaveArea } from "../helper/Helper";
import settings from "../settings/settings.json"
import FarmService from "../service/FarmService";
import tilesets from "../data/tilesets.json"
import { cageButton } from "../helper/ui/IframeArea";
import { Bed, bed_plant_history_id } from "../entity/Bed";
import { Product } from "../entity/Product";
import { ResponseFarmingRequest } from "../entity/Response";

const CAGE = settings.plot.cage
const TILESETS = tilesets
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
        const cageBeds = plotArea.plot.bed.filter(bed => bed.type === "cage");
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
            height: (CAGE.height) * TILE_SIZE + 28
        } as Area
        //load pet
        if (numberOfChicken)
            this.loadChickens(tileCageCoordinate, numberOfChicken)

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
    private getAllPets(bed: Bed) {
        if (bed.bed_plant_history_id && bed.bed_plant_history_id.length <= 0)
            return
        let numberOfChicken = 0
        bed.bed_plant_history_id.map((history: bed_plant_history_id) => {
            numberOfChicken += history.quantity
        })
        return numberOfChicken
    }
    private loadChickens(coordinate: Coordinate, quantity: number) {
        const layer = "below/below";
        const maxCols = CAGE.width - 2;
        const maxRows = CAGE.height - 2;
        const chickenRun1TileDescriptor = {
            cols: TILESETS.chicken.animation.run.width,
            rows: TILESETS.chicken.animation.run.height,
            tilesets: TILESETS.chicken.animation.run._1,
        } as MyTileDescriptor;

        let currentX = coordinate.x + 1;
        let currentY = coordinate.y + 1;

        for (let index = 0; index < quantity; index++) {
            if (currentX + 2 > coordinate.x + maxCols) {
                currentX = coordinate.x + 1;
                currentY += 1;
            }
            if (currentY > coordinate.y + maxRows) {
                break;
            }

            WA.room.setTiles(
                createTilesDescriptor(
                    { x: currentX, y: currentY },
                    chickenRun1TileDescriptor,
                    layer
                )
            );
            currentX += 2;
        }
    }

    private initVariable() {
        WA.player.state.saveVariable("confirmBuyChicken", false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("confirmBuyChicken").subscribe((e) => {
            if (e) {
                if (!WA.player.state.product) {
                    WA.player.state.saveVariable('confirmBuyChicken', false)
                    return
                }
                const product = WA.player.state.product as Product
                this.farmService.createPetRequest(product.id, product.quantity).then((response: ResponseFarmingRequest) => {
                    if (response.status == "pending") {

                        const cageCoordinate = WA.player.state.cageCoordinate as Coordinate
                        const bed = response.bed as Bed
                        const numberOfChicken = this.getAllPets(bed)
                        if (numberOfChicken)
                            this.loadChickens(cageCoordinate, numberOfChicken)

                    }
                })
                WA.player.state.saveVariable('confirmBuyChicken', false)

            }
        })
    }
}
