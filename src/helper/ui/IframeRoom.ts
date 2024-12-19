import { Area } from "../../entity/Other"
import { createEmbedWebsite } from "../Utils"
const IFRAME_URL = import.meta.env.VITE_IFRAME_URL
export function bedButton(name: string, listButton: string ) {
    const NAME = name
    const URL = IFRAME_URL + "/button/bed" + "?button=" + listButton
    const AREA = {
        coordinate: {
            x: -60,
            y: -120
        },
        width: 150,
        height: 150,
    } as Area
    const SCALE = 0.8
    const VISIBLE = true
    const ALLOWAPI = true
    const ALLOW = ""
    const ORIGIN = "player"
    return createEmbedWebsite(NAME, URL, AREA, SCALE, VISIBLE, ALLOWAPI, ALLOW, ORIGIN)
}
export function cageButton(quantity?: number) {
    const NAME = "cageButton";
    const URL = IFRAME_URL + "/button/cage?quantity=" + (quantity ?? 0);
    const AREA = {
        coordinate: {
            x: -110,
            y: -70
        },
        width: 270,
        height: 150,
    } as Area;
    const SCALE = 0.8;
    const VISIBLE = true;
    const ALLOWAPI = true;
    const ALLOW = "";
    const ORIGIN = "player";
    return createEmbedWebsite(NAME, URL, AREA, SCALE, VISIBLE, ALLOWAPI, ALLOW, ORIGIN);
}
