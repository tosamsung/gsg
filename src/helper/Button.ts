
export function plantButton() {
    return {
        label: "Trồng cây",
        callback: async () => {
            WA.player.state.saveVariable('openListCrops', true);
        },
    }
}
export function viewButton() {
    return {
        label: "Thông tin",
        callback: async () => {
            WA.player.state.saveVariable('openBedDetail', true);
        },
    }
}