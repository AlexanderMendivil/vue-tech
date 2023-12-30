import axios from 'axios'

const hackerNewsAPI = axios.create({ baseURL: "https://hacker-news.firebaseio.com/v0/" });

export const getTop500News = async () => {
    try {
        // Fetches the top 500 stories every single time
        //https://hacker-news.firebaseio.com/v0/newstories.json
        const resp = await hackerNewsAPI.get("newstories.json");
        console.log(resp)
        return resp;

    } catch (error) {
        console.log(error);
        return error;
    }

}

export const getHackerNewsItem = async (itemId) => {
    try {
        // Cannot use pagination with the API, need to use the correct ID item to obtain it
        // https://hacker-news.firebaseio.com/v0/item/8863.json
        const resp = await hackerNewsAPI.get(`item/${itemId}.json`);

        return resp;

    } catch (error) {
        console.log(error);
        return error;
    }

};

export default {
    getTop500News,
    getHackerNewsItem,
}