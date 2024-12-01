import { plantButton, viewButton } from "../helper/Button";
import { Popup } from "@workadventure/iframe-api-typings";

export class ButtonService {
    private buttonPlant: Popup | null
    private buttonView: Popup | null
    constructor() {
        this.buttonPlant = null
        this.buttonView = null

        this.initVariable()
        this.subscribeVariableChange()
    }
    openButtonPlant(id: string, label: string = '') {
        console.log(id);
        
        this.buttonPlant = WA.ui.openPopup(id, label, [
            plantButton(),
        ]);
        
    }
    closeButtonPlant() {
        this.buttonPlant?.close()
    }

    openButtonView(id: string, label: string = '') {
        console.log(id);

        this.buttonView = WA.ui.openPopup(id, label, [
            viewButton()
        ]);
    }
    closeButtonView() {
        this.buttonView?.close()
    }
    private initVariable() {
    }
    private subscribeVariableChange() {
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
                // this.closeButtonPlant()
            }

        })

    }
}