import { createArea } from "../helper/Utils";
import setting from "../settings/settings.json"
const FIRST_ROW = setting.land.first_row
const SECOND_ROW = setting.land.second_row
const THIRD_ROW = setting.land.third_row
const LANDS = setting.land;
export default class LandController {
    constructor() {

    }

    async createLandAreas() {
        const createRow = async (
            rowConfig: { coordinate: { x: number; y: number }; land_quantity: number },
            startNumber: number,
            startCols: number[],
            isHalfWidthFirst: boolean = false
        ) => {
            let currentCols = [...startCols];
            for (let index = 0; index < rowConfig.land_quantity; index++) {
                let properties = new Map<string, string | number | boolean | undefined>();
                let number = startNumber + index;
                properties.set("exitUrl", "lands/land" + number + ".tmj")
                let width = LANDS.width * 32;
                if (isHalfWidthFirst && index === 0) {
                    width /= 2;
                } else if (index > 0) {
                    let lastCols = currentCols[currentCols.length - 1];
                    currentCols = [lastCols + 1, lastCols + 2];
                }

                createArea(
                    {
                        coordinate: {
                            x: (rowConfig.coordinate.x + ((LANDS.width + LANDS.margin_right) * index)) * 32,
                            y: rowConfig.coordinate.y * 32,
                        },
                        height: LANDS.height * 32,
                        width: width,
                    },
                    "land" + number,
                    properties
                );

            }
        };

        await createRow(FIRST_ROW, 1, [1, 2], false);

        await createRow(SECOND_ROW, 10, [1, 2], false);

        await createRow(THIRD_ROW, 19, [14], true);
    }


}