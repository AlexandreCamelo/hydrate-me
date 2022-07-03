import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import Logo from '../../assets/logo.png';

function TelaEspera() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F00' }}>
            <Image
                source={Logo}
                style={{ width: 500, height: 148 }}
                PlaceholderContent={<ActivityIndicator />}
            />
        </View>
    )
}


export {
    TelaEspera,
}