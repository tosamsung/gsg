import { bedButton } from "../helper/ui/IframeRoom"

const BED_BUTTON = "bedButton"

export default class RoomIframeService {


    constructor() {

        this.initVariable()
        this.subscribeVariableChange()
    }
    showListBedButton(listButton: string) {
        WA.room.website.create(bedButton(BED_BUTTON, listButton));
    }

    closeListBedButton() {
        WA.room.website.delete(BED_BUTTON)
    }
    private initVariable() {

    }
    private subscribeVariableChange() {


    }
}
