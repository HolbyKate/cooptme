import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrCodeGenerator = ({ data }) => {
    return (
        <View>
            <QRCode
                value={data}
                size={200}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
};

export default QrCodeGenerator;
