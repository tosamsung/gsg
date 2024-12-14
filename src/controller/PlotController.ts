
import plotService from "../service/PlotService";
import { createArea, subscribeOnEnterArea, teleportByLastDirection, subscribeOnLeaveArea, deleteArea } from "../helper/Helper";
import { Plot } from "../entity/Plot";
import { Area, PlotArea } from "../entity/Other";
import settings from "../settings/settings.json"
import BedController from "./BedController";
import { ResponsePlotRegister } from "../entity/Response";
import CageController from "./CageController";
const PLOT = settings.plot
const TILE_SIZE = settings.tile_size
//----
export default class PlotController {
    private bedController: BedController
    private plotService: plotService
    private cageController: CageController
    constructor(bedController: BedController, cageController: CageController) {
        this.bedController = bedController
        this.cageController = cageController
        this.plotService = new plotService();
        this.initVariable()
        this.subscribeVariableChange()
    }

    createPlotsInLand(landNumber: number): Promise<PlotArea[]> {
        return this.plotService.getPlotsByGroupNumber(landNumber).then((response: any) => {
            return response.data;
        }).then((data) => {
            const rows = 3;
            const bigColumns = 2;
            const columns = 2;
            let arrayIndex = 0;
            let index = 0;
            const plotAreas: PlotArea[] = [];
            let startX = PLOT.start_coordinate.x;
            const startY = PLOT.start_coordinate.y;

            const calculateCoordinates = (col: number, row: number) => ({
                x: (startX + (PLOT.margin_right + PLOT.width) * col) * TILE_SIZE,
                y: (startY + (PLOT.margin_bottom + PLOT.height) * row) * TILE_SIZE,
            });

            for (let bigCol = 0; bigCol < bigColumns; bigCol++) {
                const offsetY = bigCol * rows;

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < columns; col++) {
                        const currentRow = row + 1 + offsetY;
                        const currentCol = col + 1;

                        if (data[arrayIndex]?.row === currentRow && data[arrayIndex]?.column === currentCol) {
                            const { x, y } = calculateCoordinates(col, row);
                            const plotData = data[arrayIndex];

                            // Add plot area
                            plotAreas.push({
                                area: {
                                    coordinate: { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) },
                                    width: PLOT.width,
                                    height: PLOT.height,
                                },
                                plot: plotData,
                                index: arrayIndex,
                            });

                            // Create plot area
                            this.createPlotArea({
                                area: {
                                    coordinate: {
                                        x: x + PLOT.area_relative.coordinate.x,
                                        y: y + PLOT.area_relative.coordinate.y,
                                    },
                                    width: PLOT.width * TILE_SIZE + PLOT.area_relative.width,
                                    height: PLOT.height * TILE_SIZE + PLOT.area_relative.height,
                                },
                                plot: plotData,
                                index: arrayIndex + 1,
                            });

                            arrayIndex++;
                        } else {
                            WA.room.hideLayer(`plots/plot${index + 1}`);
                        }

                        index++;
                    }
                }

                // Update starting X coordinate for the next big column
                startX += PLOT.width * 2 + PLOT.margin_right * 2;
            }

            return plotAreas;
        });

    }

    private createPlotArea(plotArea: PlotArea) {
        const area = plotArea.area
        const plot = plotArea.plot
        const plotIndex = plotArea.index
        createArea(area, plot.plot_number)
        subscribeOnEnterArea(plot.plot_number, () => {
            WA.player.state.plot = plot
            console.log(plot.plot_number);
            WA.player.state.plotIndex = plotIndex
            WA.player.state.plotArea = area
            if (plot.status == "using") {
                if (plot.owner_id !== WA.player.state.id) {
                    teleportByLastDirection(24)
                }
            } else {
                WA.player.state.saveVariable("openPlotDetail", plot.id)
            }
        })
        subscribeOnLeaveArea(plot.plot_number, () => {
            WA.player.state.plot = undefined
            WA.player.state.plotIndex = undefined
            WA.player.state.plotArea = undefined

        })
    }   
    private reloadPlotArea() {
        const plot = WA.player.state.plot as Plot
        deleteArea(plot.plot_number).then(() => {
            this.createPlotArea({
                area: WA.player.state.plotArea as Area,
                plot: plot,
                index: WA.player.state.plotIndex as number
            });
            const plotCoordinate = (WA.player.state.plotArea as Area).coordinate
            const pixelCoordinate = { x: Math.floor((plotCoordinate.x - 10) / TILE_SIZE), y: Math.floor((plotCoordinate.y - 10) / TILE_SIZE) }
            const plotArea = {
                area: {
                    coordinate: pixelCoordinate
                },
                plot: plot
            } as PlotArea
            this.bedController.createBedsAreaInPlot(plotArea)
            this.cageController.createCageArea(plotArea)
        })
    }
    private initVariable() {
        WA.player.state.saveVariable("registerPlot", false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("registerPlot").subscribe((plotId) => {
            if (plotId && this.bedController) {
                this.plotService.createRequestRegisterPlot(plotId as string).then((response: ResponsePlotRegister) => {
                    WA.player.state.saveVariable("openPlotDetail", false)
                    if (response.status == "success") {
                        WA.player.state.saveVariable("openSuccess", response.message)
                        WA.player.state.plot = response.plot
                        this.reloadPlotArea()
                    } else {
                        WA.player.state.saveVariable("openError", response.message)
                    }
                })
                WA.player.state.saveVariable('registerPlot', false)
            }
        })
    }
}
