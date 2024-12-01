
import plotService from "../service/PlotService";
import { createArea, subscribeOnEnterArea, getLandNumberFromUrl, teleportByLastDirection } from "../helper/Helper";
import { Plot } from "../entity/Plot";
import { Area } from "../entity/Area";
import settings from "../settings/settings.json"
import testData from "../data/test-data.json"
// import { EmbedWebsiteService } from "@/service/EmbedWebsiteService";
const PLOT = settings.plot
// const NOTIFICATION = settings.notification
const PlAYER = testData.player
//----
export default class PlotController {
    private plotService: plotService
    private colPerLand: number
    // private embedWebsiteService: EmbedWebsiteService
    constructor() {
        this.plotService = new plotService();
        this.colPerLand = 2
        // this.embedWebsiteService = embedWebsiteService
    }

    createPlotInLand() {
        const landNumber = getLandNumberFromUrl(WA.room.mapURL) as number
        const landInfo = this.getLandInfo(landNumber)
        return this.plotService.getAllPlotByColsAndRowPrunedData(landInfo.colStart, landInfo.colEnd, landInfo.rowStart, landInfo.rowEnd)
            .then((response: any) => {
                const data = response.data;
                console.log(data);
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
                            coordinate: {
                                x: x + 20,
                                y: y + 20,
                            },
                            width: PLOT.width * 32 - 20,
                            height: PLOT.height * 32 - 20,
                        }, plotsToShow.get(plotName)!);
                    }
                }

                return { data: data, landNumber: landNumber }
            })
            .catch((error) => {
                console.error("Error fetching plot data:", error);
            });
    }
    private createPlotArea(area: Area, plot: Plot) {
        createArea(area, plot.plot_number)
        if (plot.status == "using") {
            subscribeOnEnterArea(plot.plot_number, () => {
                if (plot.owner_id !== PlAYER.id) {
                    // WA.player.state.saveVariable("openWarning", NOTIFICATION.warning.message)
                    teleportByLastDirection(24)
                }
            })
        } else {
            subscribeOnEnterArea(plot.plot_number, () => {
                console.log("enter plot " + plot.plot_number);

                
            })
        }


    }
    getPlotPositionInLand(plotNumber: number, land: number) {
        const plotIndex = plotNumber - 1;

        let columnOffset = (land - 1) * 2;
        if (land >= 10) {
            columnOffset = (land - 10) * 2;
        }

        const column = (plotIndex % this.colPerLand) + 1 + columnOffset;

        let row = Math.floor(plotIndex / this.colPerLand) + 1;
        if (land >= 10) {
            row += 6;
        }

        return { column, row };
    }
    getPlotNumberInLand(col: number, row: number, land: number) {
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
    getLandInfo(land: number) {
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
