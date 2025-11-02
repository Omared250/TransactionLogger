
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

// 2. Check if the variable was loaded
if (!baseURL) {
    console.error("REACT_APP_API_URL is not set!");
    console.error("Please create a .env.development file with REACT_APP_API_URL=http://your-backend-url");
}

const transactionsApi = axios.create({
    baseURL: baseURL
});

export default transactionsApi;