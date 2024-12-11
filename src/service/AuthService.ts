import ApiManager from "../api/ApiManager";

export default class AuthService {
    apiManager: ApiManager

    constructor() {
        this.apiManager = new ApiManager()
    }
    
    auth(token:string){
        return this.apiManager.auth(token)
    }


}