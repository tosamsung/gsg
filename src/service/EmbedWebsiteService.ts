import { listCrops, confirmPlant, baseUrl, warning, bedDetail } from "../helper/EmbedWebsite";
import { UIWebsite } from "@workadventure/iframe-api-typings";

export class EmbedWebsiteService {
    private websiteListCrop: UIWebsite | null
    private websiteConfirmPlant: UIWebsite | null
    private websiteBaseUrl: UIWebsite | null
    private websiteWarning: UIWebsite | null
    private websiteBedDetail: UIWebsite | null

    constructor() {
        this.websiteListCrop = null
        this.websiteConfirmPlant = null
        this.websiteBaseUrl = null
        this.websiteWarning = null
        this.websiteBedDetail=null
        this.initVariable()
        this.subscribeVariableChange()
    }
    async openListCrop() {
        this.websiteListCrop = await WA.ui.website.open(
            listCrops()
        );

    }
    closeListCrop() {
        this.websiteListCrop?.close()

    }
    async openConfirmPlant(varietyId: string) {
        this.websiteConfirmPlant = await WA.ui.website.open(
            confirmPlant(varietyId)
        );

    }
    closeConfirmPlant() {
        this.websiteConfirmPlant?.close()
    }

    async openWebsiteBaseUrl() {
        this.websiteBaseUrl = await WA.ui.website.open(
            baseUrl()
        );
    }
    closeBaseUrl() {
        this.websiteBaseUrl?.close()
    }
    async openWarning(message: string) {
        this.websiteWarning = await WA.ui.website.open(
            warning(message)
        );
    }
    closeWarning() {
        this.websiteWarning?.close()
    }
    async openBedDetail(bedId: string) {
        this.websiteBedDetail = await WA.ui.website.open(
            bedDetail(bedId)
        );
    }
    closeBedDetail() {
        this.websiteBedDetail?.close()
    }
    private initVariable() {
        WA.player.state.saveVariable("confirmPlant", false)
        WA.player.state.saveVariable("openConfirmPlant", false)
        WA.player.state.saveVariable("openWarning", false)
        WA.player.state.saveVariable("openListCrops", false)
        WA.player.state.saveVariable("openBedDetail", false)

    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("openConfirmPlant").subscribe((e) => {
            e ? this.openConfirmPlant(WA.player.state.varietyId as string) : this.closeConfirmPlant()
        })
        WA.player.state.onVariableChange("openListCrops").subscribe((e) => {
            e ? this.openListCrop() : this.closeListCrop()
        })
        WA.player.state.onVariableChange("openBedDetail").subscribe((e) => {
            e ? this.openBedDetail(WA.player.state.bedId as string) : this.closeBedDetail()
        })
        WA.player.state.onVariableChange("confirmPlant").subscribe((e) => {
            if (e) {
                if (!WA.player.state.varietyId
                    || !WA.player.state.plantArea
                    || !WA.player.state.cropTileset
                    || !WA.player.state.bedInput_plotNumber
                    || !WA.player.state.bedInput_landNumber
                    || !WA.player.state.bedInput_bedIndex) {
                    return;
                }
                WA.player.state.saveVariable("openConfirmPlant", false)
                WA.player.state.saveVariable("openListCrops", false)
                WA.player.state.saveVariable("confirmPlant", false)
            }
        })
        WA.player.state.onVariableChange("openWarning").subscribe((e) => {
            const value = e as string | null
            if (value) {
                this.openWarning(value)
                WA.controls.disablePlayerControls()
                return
            } else {
                WA.controls.restorePlayerControls()
                this.closeWarning()
            }
        })
    }
}