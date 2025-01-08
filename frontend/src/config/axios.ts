import axios from "axios";

// Development
axios.defaults.baseURL = "http://localhost:5000";

// when deployed
// axios.defaults.baseURL = 'https://production-api.com';

// Add default headers
axios.defaults.headers.common["Content-Type"] = "application/json";
