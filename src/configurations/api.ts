import exp from "constants";

// config.ts
//export const API_BASE_URL: string = "http://localhost:8000";
export const API_BASE_URL: string = "https://tahlyl-backend.onrender.com";

// Services
export const BLOOD_TESTS_ENDPOINT: string = `${API_BASE_URL}/bloodtest`;

// Blood tests
export const ANALYSIS_SERVICES_ENDPOINT: string = `${API_BASE_URL}/services`;
export const ANALYSIS_SERVICE_VIEW_ENDPOINT: string = `${ANALYSIS_SERVICES_ENDPOINT}/view`

// Analysis
export const ANALYSIS_ENDPOINT: string = `${API_BASE_URL}/analysis`;
export const ANALYSIS_ANALYZE_ENDPOINT: string = `${ANALYSIS_ENDPOINT}/analyze`;