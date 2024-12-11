import AuthService from "../service/AuthService";

export default class AuthController {
    authService: AuthService
    constructor() {
        this.authService = new AuthService()

    }
    start() {
        this.initVariable()
        this.subscribeVariableChange()
    }
    private initVariable() {
        WA.player.state.saveVariable('logout', false);
        WA.player.state.saveVariable('auth', false);
    }
    private subscribeVariableChange() {
        WA.player.state.onVariableChange("logout").subscribe((e) => {
            e ? this.logout() : undefined
        })
        WA.player.state.onVariableChange("auth").subscribe((e) => {
            e ? this.auth() : undefined
        })
    }
    private auth() {
        WA.player.state.DIGIFORCE_TOKEN = localStorage.getItem("DIGIFORCE_TOKEN")
        WA.player.state.DIGIFORCE_URL = import.meta.env.VITE_DIGIFORCE_API_URL
            ? import.meta.env.VITE_DIGIFORCE_API_URL.replace(/\/$/, '')
            : ''

        if (!WA.player.state.DIGIFORCE_TOKEN) {
            return
        }
        this.authService.auth(WA.player.state.DIGIFORCE_TOKEN as string).then((reponse: any) => {
            WA.player.state.id = reponse.data.id
        })
    }
    private logout() {
        window.parent.location.href = import.meta.env.VITE_PLAY_URL + "/login";
        localStorage.removeItem("DIGIFORCE_TOKEN")
        WA.player.state.saveVariable('logout', false);
    }
}
