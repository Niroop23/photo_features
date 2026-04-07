import axios from "axios";

import { API_URL } from "./api";


export const getPosts = async () => {
    const res = await axios.get(`${API_URL}/api/posts?populate=*`);
    return res.data.data;
}