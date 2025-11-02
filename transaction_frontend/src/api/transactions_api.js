
import axios from 'axios';
import { getUserId } from '../helper/userId';

const baseURL = process.env.REACT_APP_API_URL;

// 2. Check if the variable was loaded
if (!baseURL) {
    console.error("REACT_APP_API_URL is not set!");
    console.error("Please create a .env.development file with REACT_APP_API_URL=http://your-backend-url");
}

const transactionsApi = axios.create({
    baseURL: baseURL
});

transactionsApi.interceptors.request.use( config => {
    // Get the user ID
    const userId = getUserId();
    
    // Add it as a custom header to every request
    config.headers = {
        ...config.headers,
        'x-user-id': userId
    }

    return config;
});

export default transactionsApi;