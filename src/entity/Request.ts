export interface RequestPlotRegister{
    status:"new"|"success"|"fail",
    id:string;
    plot_id:string;
    createdById: number,
    updatedById: number,
    createdAt:string,
    updatedAt:string,
    user_id:number;
    message:string;
    amount:number;
}
export interface RequestFarming{
    bed_id: string,
    product_id: number,
    action: "planting"
}