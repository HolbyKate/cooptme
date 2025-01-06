import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4247BD', '#4247BD']}
                style={styles.background}
            />
            <Video
                style={styles.logo}
                source={require('../../assets/logo_blue_video.mp4')}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
                isLooping={true}
                isMuted={true}
                useNativeControls={false}
            />
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    logo: {
        width: 200,
        height: 200,
    },
    spinner: {
        marginTop: 20,
    },
}); 