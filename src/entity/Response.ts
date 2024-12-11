import { Plot } from "./Plot";

export interface ResponsePlotRegister{
    status:string,
    id:string;
    plot_id:string;
    plot:Plot;
    createdById: number,
    updatedById: number,
    createdAt:string,
    updatedAt:string,
    user_id:number;
    message:string;
    amount:number;
}