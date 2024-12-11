export default class PlayerSerivce {
    constructor() {
    }

    subscribeOnPlayerMove() {
        WA.player.onPlayerMove((e) => {
            localStorage.setItem("playerPosition", JSON.stringify(e))
        })
    }
    disablePlayerControls() {
        WA.controls.disablePlayerControls();
    }
    restorePlayerControls() {
        WA.controls.restorePlayerControls();
    }
}