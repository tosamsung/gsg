/// <reference types="@workadventure/iframe-api-typings" />
import "./roofs";
import "./settings/DefaultSetup"
import { bootstrapExtra } from "@workadventure/scripting-api-extra";


WA.onInit().then(() => {
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export { };
