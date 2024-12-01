
export default class PlayerController {

    constructor() {
    }

     subscribeOnPlayerMove() {
        WA.player.onPlayerMove((e) => {
            WA.player.state.playerMoved = e
        })
    }
    disablePlayerControls(){
        WA.controls.disablePlayerControls();
    }
    restorePlayerControls(){
        WA.controls.restorePlayerControls();
    }
}