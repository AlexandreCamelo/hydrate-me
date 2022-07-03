import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, BackHandler, StatusBar } from 'react-native';
import VarGlobais from '../../Global'
import { Image } from 'react-native-elements';
import Homem from '../imagens/masc.png'
import Mulher from '../imagens/fem.png'
import FundoAgua from '../imagens/fundoAgua4.jpg';


function OpcaoGenero(props) {
    return (

        <View>
            <TouchableOpacity style={Estilos.genero} activeOpacity={0.0} onPress={() => props.aotTocar()}>
                <Image
                    source={props.CaminhoImagem}
                    style={{ width: props.largImagem, height: props.altImagem }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#696969' }}>{props.textoBotao}</Text>

            </TouchableOpacity>
        </View>

    )
}




function telaGenero({ navigation }) {

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('genero'); return true; });


    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>
                <StatusBar
                    backgroundColor='#006699'
                    barStyle='light-content'
                />
                
                <Text style={Estilos.texto}>Você é:</Text>
                <OpcaoGenero
                    aotTocar={() => { VarGlobais.glSexo = 'F'; console.log('Sexo escolhido: ' + VarGlobais.glSexo); navigation.navigate('idadeM') }}
                    CaminhoImagem={Mulher}
                    largImagem={66}
                    altImagem={140  }
                    textoBotao='Mulher' />
                <OpcaoGenero
                    aotTocar={() => { VarGlobais.glSexo = 'M'; console.log('Sexo escolhido: ' + VarGlobais.glSexo); navigation.navigate('idadeH') }}
                    CaminhoImagem={Homem}
                    largImagem={66}
                    altImagem={140}
                    textoBotao='Homem' />

            </ImageBackground>
        </View>

    )

}


export {
    telaGenero,
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
        //borderRadius: 10,
        //backgroundColor: '#ADD8E6',
        //borderColor: '#778899',
        //borderWidth: 3,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        //color: '#696969',
        textAlign: 'center',
        //paddingLeft: 5,
        //paddingRight: 5,
    }


})


