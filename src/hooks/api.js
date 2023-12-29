import axios from "axios"

const BASE_URL = 'http://market.sevensport.com.ar/api/process_articles'

export const postApi = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, data);
        return response.data
    } catch (error) {
        throw error
    }
};

export const getApi = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data
    } catch (error) {
        throw error
    }
}