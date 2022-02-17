import { ApiUrls } from "../models/api-urls";
import { API_BASE_URL } from "./env-constatnts";

export const apiUrls: Readonly<ApiUrls> = {
    routeToOffice: `${API_BASE_URL}api/to-office`,
    routeToLunch: `${API_BASE_URL}api/to-lunch`,
}