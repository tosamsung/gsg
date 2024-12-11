
import plotService from "../service/PlotService";
import { createArea, subscribeOnEnterArea, teleportByLastDirection, subscribeOnLeaveArea, deleteArea } from "../helper/Helper";
import { Plot } from "../entity/Plot";
import { Area, PlotArea } from "../entity/Other";
import settings from "../settings/settings.json"
import BedController from "./BedController";
import { ResponsePlotRegister } from "../entity/Response";
const PLOT = settings.plot
//----
export default class PlotController {
    private bedController: BedController | null
    private plotService: plotService
    private colPerLand: number
    constructor(bedController?: BedController) {
        this.bedController = bedController ? bedController : null
        this.plotService = new plotService();
        this.colPerLand = 2
        this.initVariable()
        this.subscribeVariableChange()
    }

    createPlotsInLand(landNumber: number) {
        const landInfo = this.getLandInfo(landNumber)
        return this.plotService.getAllPlotByColsAndRowPrunedData(landInfo.colStart, landInfo.colEnd, landInfo.rowStart, landInfo.rowEnd)
            .then((response: any) => {
                const data = response.data;
                const plotsToShow: Map<string, Plot> = new Map;
                data.forEach((plot: Plot) => {
                    const plotName = "plot" + this.getPlotNumberInLand(plot.column, plot.row, landNumber);
                    plotsToShow.set(plotName, plot);
                });

                for (let i = 1; i <= 12; i++) {
                    const plotName = "plot" + i;
                    if (!plotsToShow.get(plotName)) {
                        WA.room.hideLayer("plots/" + plotName);
                    } else if (plotsToShow.get(plotName)) {
                        const columnsPerRow = 2;

                        const columnIndex = (i - 1) % columnsPerRow;
                        const rowIndex = Math.floor((i - 1) / columnsPerRow);

                        const x = (PLOT.start_coordinate.x + (PLOT.margin_right + PLOT.width) * columnIndex) * 32;
                        const y = (PLOT.start_coordinate.y + (PLOT.margin_bottom + PLOT.height) * rowIndex) * 32;

                        this.createPlotArea({
                            plotArea: {
                                coordinate: {
                                    x: x + 20,
                                    y: y + 20,
                                },
                                width: PLOT.width * 32 - 20,
                                height: PLOT.height * 32 - 20,
                            },
                            plot: plotsToShow.get(plotName)!,
                            index: i
                        });
                    }
                }

                return { data: data }
            })
            .catch((error) => {
                console.error("Error fetching plot data:", error);
            });
    }
    private createPlotArea(plotArea: PlotArea) {
        const area = plotArea.plotArea
        const plot = plotArea.plot
        const plotIndex = plotArea.index
        createArea(area, plot.plot_number)
        subscribeOnEnterArea(plot.plot_number, () => {
            WA.player.state.plot = plot
            WA.player.state.plotIndex = plotIndex
            WA.player.state.plotArea = area
            if (plot.status == "using") {
                if (plot.owner_id !== WA.player.state.id) {

                    teleportByLastDirection(24)
                } else {
                    console.log("is mine");
                    console.log(WA.player.state.plotArea);
                }

            } else {
                WA.player.state.saveVariable("openPlotDetail", (WA.player.state.plot as Plot).id)
            }
        })
        subscribeOnLeaveArea(plot.plot_number, () => {
            WA.player.state.plot = undefined
            WA.player.state.plotIndex = undefined
            WA.player.state.plotArea = undefined

        })
    }
    private reloadPlotArea(plot: Plot) {
        deleteArea(plot.plot_number).then(() => {
            this.createPlotArea({
                plotArea: WA.player.state.plotArea as Area,
                plot: plot,
                index: WA.player.state.plotIndex as number
            });
            const plotCoordinate = (WA.player.state.plotArea as Area).coordinate
            const pixelCoordinate = { x: Math.floor(plotCoordinate.x / 32), y: Math.floor(plotCoordinate.y / 32) }
            this.bedController?.createEmptyBedAreaInPlot(
                pixelCoordinate,
                plot,
                WA.player.state.landName as string)
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
                        this.reloadPlotArea(response.plot)
                    } else if (response.status == "fail_balance") {
                        WA.player.state.saveVariable("openError", response.message)

                    }
                    console.log(response);
                })
                WA.player.state.saveVariable('registerPlot', false)
            }
        })
    }
    // private getPlotPositionInLand(plotNumber: number, land: number) {
    //     const plotIndex = plotNumber - 1;

    //     let columnOffset = (land - 1) * 2;
    //     if (land >= 10) {
    //         columnOffset = (land - 10) * 2;
    //     }

    //     const column = (plotIndex % this.colPerLand) + 1 + columnOffset;

    //     let row = Math.floor(plotIndex / this.colPerLand) + 1;
    //     if (land >= 10) {
    //         row += 6;
    //     }

    //     return { column, row };
    // }
    private getPlotNumberInLand(col: number, row: number, land: number) {
        let columnOffset: number;

        if (land === 19) {
            if (col !== 14) {
                throw new Error(`Invalid column ${col} for Land 19. Only column 14 is valid.`);
            }

            const plotIndex = (row - 1);
            return plotIndex + 1;
        }

        if (land >= 10) {
            columnOffset = (land - 10) * 2;
        } else {
            columnOffset = (land - 1) * 2;
        }

        const adjustedColumn = col - columnOffset;

        if ((land !== 19 && (adjustedColumn < 1 || adjustedColumn > 2))) {
            throw new Error(`Invalid column ${col} for Land ${land}.`);
        }

        const plotIndex = (row - 1) * this.colPerLand + (adjustedColumn - 1);
        return plotIndex + 1;
    }
    private getLandInfo(land: number) {
        let colStart: number, colEnd: number, rowStart: number, rowEnd: number;
        if (land < 10) {
            colStart = (land - 1) * 2 + 1;
            colEnd = colStart + 1;
            rowStart = 1;
            rowEnd = 6;
        } else if (land === 19) {
            colStart = 14;
            colEnd = 14;
            rowStart = 1;
            rowEnd = 6;
        } else {
            const landOffset = (land - 10) % 9;
            colStart = landOffset * 2 + 1;
            colEnd = colStart + 1;
            rowStart = 7;
            rowEnd = 12;
        }

        return { colStart, colEnd, rowStart, rowEnd };
    }


}
