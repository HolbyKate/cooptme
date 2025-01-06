export const CONFIG = {
    API_URL: 'http://192.168.31.149:3000/api',
    API_TIMEOUT: 10000,
    AUTH_ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GOOGLE: '/auth/google',
        APPLE: '/auth/apple',
        FORGOT_PASSWORD: '/auth/forgot-password'
    },
    STORAGE_KEYS: {
        USER_TOKEN: 'userToken',
        USER_DATA: 'userData',
        LINKEDIN_AUTH: 'linkedinAuth',
        PROFILES: 'profiles'
    }
};

export default CONFIG;