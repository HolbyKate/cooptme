declare module '@env' {
  export const EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
  export const EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
  export const JWT_SECRET: string;
}

declare module '*.env' {
  const value: string;
  export default value;
}