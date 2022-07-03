import React from 'react';
import { View, StyleSheet, ImageBackground, } from 'react-native';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import BotoesAlarmes from '../botoesAlarmes'


function telaAlarmes({ navigation }) {
        return (
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>
                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}> */}
                <BotoesAlarmes  />
                
                {/* </View> */}

            </ImageBackground>
        // </View>
    )
}

export {
    telaAlarmes,
}

const Estilos = StyleSheet.create({
    botaoRelogio: {
        width: '50%',
        height: 140,
        justifyContent: 'center',
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


    genero: {
        display: 'flex',
        flexDirection: 'row',
        width: '70%',
        height: 180,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,

        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderWidth: 5,
        borderColor: '#778899',
        borderRadius: 10,
        //borderBottomLeftRadius: 10,
        padding: 5,
        backgroundColor: '#ADD8E6',
    },

    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
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
        paddingLeft: 5,
        paddingRight: 5,
    }


})


