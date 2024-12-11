import { plantButton, viewButton } from "../helper/ui/Button";
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
        this.buttonPlant = WA.ui.openPopup(id, label, [
            plantButton(),
        ]);
    }
    closeButtonPlant() {
        this.buttonPlant?.close()
    }
    openButtonView(id: string, label: string = '') {
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


    }
}