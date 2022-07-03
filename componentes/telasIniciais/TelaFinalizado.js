import React from 'react';
import { Text, View, StyleSheet, BackHandler } from 'react-native';
import { Image } from 'react-native-elements';
import Logo from '../../assets/logoInternacional.png'


function telaFinalizado({ navigation }) {

//Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
BackHandler.addEventListener("hardwareBackPress", ()=>{navigation.navigate('finalizado'); return true});

    return (
        <View style={{ flex: 1, width: '100%', height: 400, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
            <View >
                <Image
                    source={Logo}
                    style={{ width: 500, height: 148, borderWidth: 1, borderColor: '#FFF' }}
                    resizeMode="contain"
                />

            </View>

            <Text style={Estilos.texto}>Finalizado</Text>
            <Text  style={Estilos.texto2}>Obrigado por usar nosso app!</Text>
            <View>

               
            </View>


        </View >

    )

}

export {
    telaFinalizado,
}





const Estilos = StyleSheet.create({

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
        fontSize: 40,
        fontWeight: 'bold',
        color: '#696969',
        textAlign: 'center',
    },

    texto2: {
        fontSize: 20,
        color: '#696969',
        textAlign: 'center',
    }


})
