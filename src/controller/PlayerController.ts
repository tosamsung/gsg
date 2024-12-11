import PlayerSerivce from "../service/PlayerService";

export default class PlayerController {
    playerService: PlayerSerivce
    constructor() {
        this.playerService = new PlayerSerivce
    }

    subscribeOnPlayerMove() {
        this.playerService.subscribeOnPlayerMove()
    }
    disablePlayerControls() {
        this.playerService.disablePlayerControls();
    }
    restorePlayerControls() {
        this.playerService.restorePlayerControls();
    }
}