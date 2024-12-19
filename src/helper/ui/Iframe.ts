import { createUIWebsite } from "../Utils";
const IFRAME_URL = import.meta.env.VITE_IFRAME_URL
export function listCrops() {
    let width = "70vw"
    let height = "75vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "80vh"
            vertical = "top"
            break;
        case "tablet":
            break;
        case "desktop":
            vertical = "middle"
            break;
        default:
            break;
    }
    return createUIWebsite(
        "listCrops",
        IFRAME_URL + "/crops",
        vertical,
        horizontal,
        width,
        height
    )
}
export function listChickens() {
    let width = "70vw"
    let height = "75vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "80vh"
            vertical = "top"
            break;
        case "tablet":
            break;
        case "desktop":
            vertical = "middle"
            break;
        default:
            break;
    }
    return createUIWebsite(
        "listChickens",
        IFRAME_URL + "/chickens",
        vertical,
        horizontal,
        width,
        height
    )
}
export function confirmPlant(varietyId: string) {
    let width = "40vw"
    let height = "85vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    let margin = {
        bottom: "100px"
    }
    // let allowPolicy="allowPolicy"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "confirmPlant",
        IFRAME_URL + `/confirm/plant/${varietyId}`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}
export function confirmBuyChicken(chickenId: string) {
    let width = "40vw"
    let height = "85vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    let margin = {
        bottom: "100px"
    }
    // let allowPolicy="allowPolicy"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "confirmBuyChicken",
        IFRAME_URL + `/confirm/chicken/${chickenId}`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}
export function baseUrl() {
    let width = "100vw"
    let height = "100vh"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "left" as "middle" | "left" | "right"
    let visible = false
    return createUIWebsite(
        "baseUrl",
        IFRAME_URL,
        vertical,
        horizontal,
        width,
        height,
        visible
    )
}
export function error(message: string) {
    let width = "70vw"
    let height = "90vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "warning",
        IFRAME_URL + `/error?message=${message}`,
        vertical,
        horizontal,
        width,
        height
    )
}
export function success(message: string) {
    let width = "70vw"
    let height = "50vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "success",
        IFRAME_URL + `/success?message=${message}`,
        vertical,
        horizontal,
        width,
        height
    )
}
export function bedDetail(bedId: string) {
    let width = "35vw"
    let height = "60vh"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }

    return createUIWebsite(
        "bedDetail",
        IFRAME_URL + `/bed/${bedId}`,
        vertical,
        horizontal,
        width,
        height
    )
}
export function login() {
    let width = "70vw"
    let height = "90vh"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "85vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "login",
        IFRAME_URL + `/login`,
        vertical,
        horizontal,
        width,
        height,
        true,
        true,
        ""
    )
}
export function authScreen() {
    let width = "100vh"
    let height = "100vw"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "left" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "85vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "login",
        IFRAME_URL + `/login`,
        vertical,
        horizontal,
        width,
        height,
        true,
        true,
        ""
    )
}
export function register() {
    let width = "70vw"
    let height = "80vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "register",
        IFRAME_URL + `/register`,
        vertical,
        horizontal,
        width,
        height
    )
}
export function profile() {
    let width = "40vw"
    let height = "80vh"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "user",
        IFRAME_URL + `/user`,
        vertical,
        horizontal,
        width,
        height
    )
}
export function plotDetail(plotId: string) {
    let width = "50vw"
    let height = "60vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    let margin = {
        bottom: "100px"
    }
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "confirmPlant",
        IFRAME_URL + `/plot/${plotId}`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}
export function wallet() {
    let width = "17vw"
    let height = "10vh"
    let vertical = "top" as "middle" | "top" | "bottom"
    let horizontal = "right" as "middle" | "left" | "right"
    let margin = {
        top: "10px"
    }
    // let allowPolicy="allowPolicy"
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            width = "90vw"
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "wallet",
        IFRAME_URL + `/wallet`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}
export function confirmFeedingPrice() {
    let width = "50vw"
    let height = "60vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    let margin = {
        bottom: "100px"
    }
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "confirmPlant",
        IFRAME_URL + `/confirm/chicken/feeding`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}
export function confirmWatering() {
    let width = "50vw"
    let height = "60vh"
    let vertical = "middle" as "middle" | "top" | "bottom"
    let horizontal = "middle" as "middle" | "left" | "right"
    let margin = {
        bottom: "100px"
    }
    const screenSize = WA.player.state.screen
    switch (screenSize) {
        case "mobile":
            width = "98vw"
            height = "75vh"
            break;
        case "tablet":
            break;
        case "desktop":
            break;
        default:
            break;
    }
    return createUIWebsite(
        "confirmWatering",
        IFRAME_URL + `/confirm/watering`,
        vertical,
        horizontal,
        width,
        height,
        true, // visible is true by default, but you can pass it explicitly if needed
        true, // allowApi is true by default
        "", // allowPolicy is empty string by default
        margin
    )
}