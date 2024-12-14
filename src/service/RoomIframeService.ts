import { bedButton } from "../helper/ui/IframeArea"

const BED_BUTTON = "bedButton"

export default class RoomIframeService {


    constructor() {

        this.initVariable()
        this.subscribeVariableChange()
    }
    showListBedButton() {
        WA.room.website.create(bedButton(BED_BUTTON));
    }

    closeListBedButton() {
        WA.room.website.delete(BED_BUTTON)
    }
    private initVariable() {

    }
    private subscribeVariableChange() {


    }
}
