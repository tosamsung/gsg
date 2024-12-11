import Bed from "../entity/Bed";
import { listCrops, confirmPlant, baseUrl, error, bedDetail, login, register, profile, plotDetail, wallet, success } from "../helper/ui/Iframe";
import { UIWebsite } from "@workadventure/iframe-api-typings";

class IframeService {
    //notificate
    private iframeError: UIWebsite | null
    private iframeSuccess: UIWebsite | null


    private iframeListCrop: UIWebsite | null
    private iframeConfirmPlant: UIWebsite | null
    private iframeBaseUrl: UIWebsite | null
    private iframeBedDetail: UIWebsite | null
    private iframeLogin: UIWebsite | null
    private iframeRegister: UIWebsite | null
    private iframeProfile: UIWebsite | null
    private iframePlotDetail: UIWebsite | null
    private iframeWallet: UIWebsite | null

    constructor() {
        this.iframeListCrop = null
        this.iframeConfirmPlant = null
        this.iframeBaseUrl = null
        this.iframeError = null
        this.iframeBedDetail = null
        this.iframeLogin = null
        this.iframeRegister = null
        this.iframeProfile = null
        this.iframePlotDetail = null
        this.iframeWallet = null
        this.iframeSuccess = null
        this.initVariable()
        this.subscribeVariableChange()

    }
    async openWallet() {
        this.closeWallet()
        this.iframeWallet = await WA.ui.website.open(
            wallet()
        );
    }
    async openPlotDetail(id: string) {
        this.closePlotDetail()
        this.iframePlotDetail = await WA.ui.website.open(
            plotDetail(id)
        );
    }
    async openLogin() {
        this.closeLogin()
        this.iframeLogin = await WA.ui.website.open(
            login()
        );
    }
    async openProfile() {
        this.closeProfile()
        this.iframeProfile = await WA.ui.website.open(
            profile()
        );
    }
    async openRegister() {
        this.closeRegister()
        this.iframeRegister = await WA.ui.website.open(
            register()
        );
    }
    async openListCrop() {
        this.closeListCrop()
        this.iframeListCrop = await WA.ui.website.open(
            listCrops()
        );
    }

    async openConfirmPlant(varietyId: string) {
        this.closeConfirmPlant()
        this.iframeConfirmPlant = await WA.ui.website.open(
            confirmPlant(varietyId)
        );
    }
    async openWebsiteBaseUrl() {
        this.closeBaseUrl()
        return this.iframeBaseUrl = await WA.ui.website.open(
            baseUrl()
        );
    }
    async openError(message: string) {
        this.closeError()
        this.iframeError = await WA.ui.website.open(
            error(message)
        );
    }
    async openSuccess(message: string) {
        this.closeSuccess()
        this.iframeSuccess = await WA.ui.website.open(
            success(message)
        );
    }
    async openBedDetail(bedId: string) {
        this.closeBedDetail()
        this.iframeBedDetail = await WA.ui.website.open(
            bedDetail(bedId)
        );
    }
    closeRegister() {
        this.iframeRegister?.close()
    }
    closeLogin() {
        this.iframeLogin?.close()
    }
    closeListCrop() {
        this.iframeListCrop?.close()
    }
    closeConfirmPlant() {
        this.iframeConfirmPlant?.close()
    }
    closeBaseUrl() {
        this.iframeBaseUrl?.close()
    }
    closeError() {
        this.iframeError?.close()
    }
    closeSuccess() {
        this.iframeSuccess?.close()
    }
    closeBedDetail() {
        this.iframeBedDetail?.close()
    }
    closeProfile() {
        this.iframeProfile?.close()
    }
    closePlotDetail() {
        this.iframePlotDetail?.close()
    }
    closeWallet() {
        this.iframeWallet?.close()
    }
    private initVariable() {
        //notificate
        WA.player.state.saveVariable("openError", false)
        WA.player.state.saveVariable("openSuccess", false)



        WA.player.state.saveVariable("openConfirmPlant", false)
        WA.player.state.saveVariable("openListCrops", false)
        WA.player.state.saveVariable("openBedDetail", false)
        WA.player.state.saveVariable("openLogin", false)
        WA.player.state.saveVariable("openRegister", false)
        WA.player.state.saveVariable("openProfile", false)
        WA.player.state.saveVariable("openPlotDetail", false)
        WA.player.state.saveVariable("openWallet", false)


    }
    private subscribeVariableChange() {
        //notificate
        WA.player.state.onVariableChange("openSuccess").subscribe((message) => {
            message ? this.openSuccess(message as string) : this.closeSuccess()
        })
        WA.player.state.onVariableChange("openError").subscribe((message) => {
            message ? this.openError(message as string) : this.closeError()
        })

        WA.player.state.onVariableChange("openWallet").subscribe((e) => {
            e ? this.openWallet() : this.closeWallet()
        })
        WA.player.state.onVariableChange("openPlotDetail").subscribe((e) => {
            e ? this.openPlotDetail(e as string) : this.closePlotDetail()
        })
        WA.player.state.onVariableChange("openLogin").subscribe((e) => {
            e ? this.openLogin() : this.closeLogin()
        })
        WA.player.state.onVariableChange("openProfile").subscribe((e) => {
            e ? this.openProfile() : this.closeProfile()
        })
        WA.player.state.onVariableChange("openRegister").subscribe((e) => {
            e ? this.openRegister() : this.closeRegister()
        })
        WA.player.state.onVariableChange("openConfirmPlant").subscribe((e) => {
            e ? this.openConfirmPlant(WA.player.state.varietyId as string) : this.closeConfirmPlant()
        })
        WA.player.state.onVariableChange("openListCrops").subscribe((e) => {
            e ? this.openListCrop() : this.closeListCrop()
        })
        WA.player.state.onVariableChange("openBedDetail").subscribe((e) => {
            e ? this.openBedDetail((WA.player.state.bed as Bed).id as string) : this.closeBedDetail()
        })

    }
}
const iframeService = new IframeService()
export default iframeService