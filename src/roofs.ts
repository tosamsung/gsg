/// <reference types="@workadventure/iframe-api-typings/iframe_api" />

console.info('Roofs Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    WA.room.area.onEnter("roof_conference_area").subscribe(() => {
        hideRoof1();
    });
    WA.room.area.onEnter("roof_coworking_area").subscribe(() => {
        hideRoof1();
    });
    WA.room.area.onEnter("roof_office_area").subscribe(() => {
        hideRoof1();
    });
    WA.room.area.onLeave("roof_conference_area").subscribe(() => {
        showRoof1();
    });
    WA.room.area.onLeave("roof_coworking_area").subscribe(() => {
        showRoof1();
    });
    WA.room.area.onLeave("roof_office_area").subscribe(() => {
        showRoof1();
    });
    WA.room.area.onEnter("roof_meeting_area").subscribe(() => {
        hideRoof2();
    });
    WA.room.area.onEnter("roof_show_area").subscribe(() => {
        hideRoof2();
    });
    WA.room.area.onLeave("roof_meeting_area").subscribe(() => {
        showRoof2();
    });
    WA.room.area.onLeave("roof_show_area").subscribe(() => {
        showRoof2();
    });
    WA.room.area.onEnter("silentOffice_area").subscribe(() => {
        WA.room.showLayer("silentOverlay");
    });
    WA.room.area.onLeave("silentOffice_area").subscribe(() => {
        WA.room.hideLayer("silentOverlay"); 
    });

  
}).catch(e => console.error(e));

const hideRoof1 = () => {
    WA.room.hideLayer("roof1");
    WA.room.hideLayer("sign1");
}
const showRoof1 = () => {
    WA.room.showLayer("roof1");
    WA.room.showLayer("sign1");
}
const showRoof2 = () => {
    WA.room.showLayer("roof2");
    WA.room.showLayer("sign2");
}
const hideRoof2 = () => {
    WA.room.hideLayer("roof2");
    WA.room.hideLayer("sign2");
}

export {}
