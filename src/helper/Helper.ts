import { Area } from "../entity/Other";
import { Coordinate } from "../entity/Other";
import { MovementState } from "../entity/Other";
import  iframeService  from "../service/IframeService";
import { CreateEmbeddedWebsiteEvent, UIWebsiteEvent } from "@workadventure/iframe-api-typings";

export async function createArea(area: Area, name: string, property?: Map<string, string | number | boolean | undefined>) {
    WA.room.area.create({
        height: area.height,
        width: area.width,
        x: area.coordinate.x,
        y: area.coordinate.y,
        name: name
    })
    if (property) {
        if (property.size > 0) {
            const area = await WA.room.area.get(name)

            property.forEach((value, key) => {
                area.setProperty(key, value)
            });
        }
    }
}
export function deleteArea(name: string) {
    return WA.room.area.delete(name)
}
export function subscribeOnEnterArea(name: string, callback: () => void) {

    WA.room.area.onEnter(name).subscribe().unsubscribe()
    WA.room.area.onEnter(name).subscribe(callback)
    // WA.room.area.onEnter(name).subscribe(()=>{
    //     console.log(1);

    // })

}
export function subscribeOnLeaveArea(name: string, callback: () => void) {
    WA.room.area.onLeave(name).subscribe(callback)
}
export function getLandNumberFromUrl(url: string) {
    const match = url.match(/land(\d+)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}
export function extractNumberFromString(input: string): number | null {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

export function createEmbedWebsite(
    name: string,
    url: string,
    x: number,
    y: number,
    height: number,
    width: number,
    scale: number
): CreateEmbeddedWebsiteEvent {
    return {
        name: name,
        url: url,
        position: {
            x: x,
            y: y,
            width: width,
            height: height,
        },
        visible: true,
        allowApi: true,
        scale: scale,
    };
}
export function createUIWebsite(
    id: string,
    url: string,
    vertical: "top" | "middle" | "bottom",
    horizontal: "left" | "middle" | "right",
    width: string,
    height: string,
    visible: boolean = true,
    allowApi: boolean = true,
    allowPolicy: string = "",
    margin?: {
        top?: string,
        bottom?: string,
        right?: string,
        left?: string
    }
): UIWebsiteEvent {
    return {
        id: id,
        url: url,
        position: {
            vertical: vertical,
            horizontal: horizontal,
        },
        size: {
            width: width,
            height: height,
        },
        margin,
        visible: visible,
        allowApi: allowApi,
        allowPolicy: allowPolicy,
    };
}


export function teleportByLastDirection(pixel: number): void {
    const playerMoved: MovementState = JSON.parse(localStorage.getItem("playerPosition") || "{}");
    // console.log(playerMoved);

    switch (playerMoved.direction) {
        case "left":
            WA.player.teleport(playerMoved.x - pixel, playerMoved.y)
            break;
        case "right":
            WA.player.teleport(playerMoved.x + pixel, playerMoved.y)
            break;
        case "up":
            WA.player.teleport(playerMoved.x, playerMoved.y + pixel)
            break;
        case "down":
            WA.player.teleport(playerMoved.x, playerMoved.y - pixel)
            break;
    }
}
export function teleportPlayerTo(coordinate: Coordinate): void {
    // console.log(playerMoved);
    WA.player.teleport(coordinate.x, coordinate.y)
}


export function checkDeviceScreen() {
    const embedWebsiteService =iframeService
    embedWebsiteService.openWebsiteBaseUrl().then(() => {
        embedWebsiteService.closeBaseUrl()

    })
}
