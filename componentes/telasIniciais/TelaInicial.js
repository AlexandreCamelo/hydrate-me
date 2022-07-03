import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import { Image } from 'react-native-elements';
import Legal from '../imagens/legal.png';
import FundoAgua from '../imagens/fundoAgua4.jpg';

function TelaInicio({ navigation }) {

    return (

        
                <View style={{ flex: 1, width: '100%', height: 400, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                    <ImageBackground source={FundoAgua} style={Estilos.fundo}>
                        <StatusBar
                            backgroundColor='#006699'
                            barStyle="light-content"
                        />
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: "#FFF" }}>Para iniciar,</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: "#FFF" }}>nos dê algumas informações:</Text>


                        <View>

                            <TouchableOpacity style={Estilos.genero} activeOpacity={0.0} onPress={() => navigation.navigate('genero')}>
                                <Image
                                    source={Legal}
                                    style={{ width: 130, height: 130 }}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#696969' }}>Vamos lá!</Text>
                            </TouchableOpacity>

                        </View>

                    </ImageBackground>
                </View >
        
    )



}

export {
    TelaInicio,
}





const Estilos = StyleSheet.create({

    genero: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        height: 180,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderWidth: 5,
        borderColor: '#778899',
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#ADD8E6',
    },

    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'repeat',
    },

    texto: {
        borderRadius: 10,
        backgroundColor: '#ADD8E6',
        borderColor: '#778899',
        borderWidth: 3,
        fontSize: 50,
        fontWeight: 'bold',
        color: '#696969',
        textAlign: 'center',
    }


})
