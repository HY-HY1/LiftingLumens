import { AxiosResponse } from "axios";

export interface ResponseTypes extends AxiosResponse{
    success: boolean;
    data: any;
    message: string;
}