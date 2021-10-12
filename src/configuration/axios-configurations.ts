import axios from 'axios';
import {Resources} from "./Resources";

export const getAxios = () => {
    const instance = axios.create({
        baseURL: Resources.api,
    });

    return instance;
};