import { bootstrapExtra } from "@workadventure/scripting-api-extra/dist";
import { checkDeviceScreen } from "../helper/Helper";
import PlayerController from "../controller/PlayerController";
import AuthController from "../controller/AuthController";
import "../data/StaticData";
const playerController = new PlayerController()
const authController = new AuthController()
WA.onInit().then(() => {
    authController.start()
    playerController.subscribeOnPlayerMove()
    //Ui
    // WA.player.state.saveVariable("openWallet", true)
    checkDeviceScreen()
    WA.ui.actionBar.addButton({
        id: 'profile',
        type: 'action',
        imageSrc: 'https://cdn.vectorstock.com/i/preview-1x/32/62/contact-dark-mode-glyph-ui-icon-vector-43353262.jpg',
        toolTip: '',
        callback: () => {
            WA.player.state.saveVariable("openProfile", true)
        }
    });
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));