import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const ScanQrCode = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // Supposons que 'data' est l'URL ou l'ID pour récupérer les infos via l'API backend
        axios.get(`http://votre-backend-url/api/profiles/${data}`)
            .then(response => {
                // Traitez les données reçues
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    if (hasPermission === null) {
        return <Text>Demande de permission pour accéder à la caméra</Text>;
    }
    if (hasPermission === false) {
        return <Text>Accès à la caméra refusé</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ flex: 1 }}
            />
            {scanned && <Button title={'Scanner de nouveau'} onPress={() => setScanned(false)} />}
        </View>
    );
};

export default ScanQrCode;

