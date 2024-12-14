import Bed from "../entity/Bed";
import { listCrops, confirmPlant, baseUrl, error, bedDetail, login, register, profile, plotDetail, wallet, success, listChickens, confirmBuyChicken } from "../helper/ui/Iframe";
import { UIWebsite } from "@workadventure/iframe-api-typings";

class UiIframeService {
    //notificate
    private iframeError: UIWebsite | null
    private iframeSuccess: UIWebsite | null
    //list
    private iframeListCrops: UIWebsite | null
    private iframeListChickens: UIWebsite | null
    //confirm
    private iframeConfirmPlant: UIWebsite | null
    private iframeConfirmBuyChicken: UIWebsite | null

    private iframeBaseUrl: UIWebsite | null
    private iframeBedDetail: UIWebsite | null
    private iframeLogin: UIWebsite | null
    private iframeRegister: UIWebsite | null
    private iframeProfile: UIWebsite | null
    private iframePlotDetail: UIWebsite | null
    private iframeWallet: UIWebsite | null

    constructor() {
        this.iframeListCrops = null
        this.iframeListChickens = null
        this.iframeConfirmBuyChicken = null
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

    async openWebsiteBaseUrl() {
        this.closeBaseUrl()
        return this.iframeBaseUrl = await WA.ui.website.open(
            baseUrl()
        );
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
    //list
    async openListCrops() {
        this.closeListCrops()
        this.iframeListCrops = await WA.ui.website.open(
            listCrops()
        );
    }
    async openListChickens() {
        this.closeListChickens()
        this.iframeListChickens = await WA.ui.website.open(
            listChickens()
        );
    }
    //confirm
    async openConfirmPlant(varietyId: string) {
        this.closeConfirmPlant()
        this.iframeConfirmPlant = await WA.ui.website.open(
            confirmPlant(varietyId)
        );
    }
    async openConfirmBuyChicken(chickenId: string) {
        this.closeConfirmBuyChicken()
        this.iframeConfirmBuyChicken = await WA.ui.website.open(
            confirmBuyChicken(chickenId)
        );
    }
    //notificate
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
    //list
    closeListCrops() {
        this.iframeListCrops?.close()
    }
    closeListChickens() {
        this.iframeListChickens?.close()
    }
    //confirm
    closeConfirmPlant() {
        this.iframeConfirmPlant?.close()
    }
    closeConfirmBuyChicken() {
        this.iframeConfirmBuyChicken?.close()
    }
    closeBaseUrl() {
        this.iframeBaseUrl?.close()
    }
    //notificate
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
        //list
        WA.player.state.saveVariable("openListCrops", false)
        WA.player.state.saveVariable("openListChickens", false)

        WA.player.state.saveVariable("openBedDetail", false)
        WA.player.state.saveVariable("openLogin", false)
        WA.player.state.saveVariable("openRegister", false)
        WA.player.state.saveVariable("openProfile", false)
        WA.player.state.saveVariable("openPlotDetail", false)
        WA.player.state.saveVariable("openWallet", false)

        //confirm
        WA.player.state.saveVariable("openConfirmPlant", false)
        WA.player.state.saveVariable("openConfirmBuyChicken", false)
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
        //confirm
        WA.player.state.onVariableChange("openConfirmPlant").subscribe((e) => {
            e ? this.openConfirmPlant(WA.player.state.varietyId as string) : this.closeConfirmPlant()
        })
        WA.player.state.onVariableChange("openConfirmBuyChicken").subscribe((e) => {
            e ? this.openConfirmBuyChicken(WA.player.state.chickenId as string) : this.closeConfirmBuyChicken()
        })
        //list
        WA.player.state.onVariableChange("openListCrops").subscribe((e) => {
            e ? this.openListCrops() : this.closeListCrops()
        })
        WA.player.state.onVariableChange("openListChickens").subscribe((e) => {
            e ? this.openListChickens() : this.closeListChickens()
        })
        WA.player.state.onVariableChange("openBedDetail").subscribe((e) => {
            e ? this.openBedDetail((WA.player.state.bed as Bed).id as string) : this.closeBedDetail()
        })

    }
}
const iframeService = new UiIframeService()
export default iframeService