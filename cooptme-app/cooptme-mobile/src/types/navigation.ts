import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    MainApp: undefined;
    Dashboard: undefined;
    Home: undefined;
    Profiles: { userId?: string };
    ProfileDetail: { profileId: string };
    Events: undefined;
    Chat: undefined;
    Scan: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type MainAppScreenProps = NativeStackScreenProps<RootStackParamList, 'MainApp'>;
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ProfilesScreenProps = NativeStackScreenProps<RootStackParamList, 'Profiles'>;
export type ProfileDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileDetail'>;
export type EventsScreenProps = NativeStackScreenProps<RootStackParamList, 'Events'>;
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;
export type ScanScreenProps = NativeStackScreenProps<RootStackParamList, 'Scan'>;
