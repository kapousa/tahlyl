import exp from "constants";

// config.ts
export const API_BASE_URL: string = "http://localhost:8000";
//export const API_BASE_URL: string = "https://tahlyl-backend.onrender.com";

// Users
export const USERS_ENDPOINT: string = `${API_BASE_URL}/users`;
export const USER_LOGIN_ENDPOIN: string = `${USERS_ENDPOINT}/login`;
export const USER_REGISTER_ENDPOIN: string = `${USERS_ENDPOINT}/register`;

// Services
export const BLOOD_TESTS_ENDPOINT: string = `${API_BASE_URL}/bloodtest`;

// Medical Reports
export const MEDICAL_REPORT_ENDPOINT: string = `${API_BASE_URL}/report`;
export const MEDICAL_REPORT_LIST_CARDS_ENDPOINT: string = `${MEDICAL_REPORT_ENDPOINT}/cards`

// Analysis services
export const ANALYSIS_SERVICES_ENDPOINT: string = `${API_BASE_URL}/services`;
export const ANALYSIS_SERVICE_VIEW_ENDPOINT: string = `${ANALYSIS_SERVICES_ENDPOINT}/view`

// Analysis
export const ANALYSIS_ENDPOINT: string = `${API_BASE_URL}/analysis`;
export const ANALYSIS_ANALYZE_ENDPOINT: string = `${ANALYSIS_ENDPOINT}/analyze`;