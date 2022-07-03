import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import VarGlobais from '../../Global'
import { Image } from 'react-native-elements';
import Adolescente from '../imagens/mAdolescente.png'
import Adulta from '../imagens/mAdulta.png'
import Velha from '../imagens/mVelha.png'
import MuitoVelha from '../imagens/mMuitoVelha.png'
import FundoAgua from '../imagens/fundoAgua4.jpg';

function OpcaoIdade(props) {
    return (
        <View>
            <TouchableOpacity style={Estilos.idade} activeOpacity={0.0} onPress={() => props.aoClicar()}>
                <Image
                    source={props.CaminhoImagem}
                    style={{ width: props.largImagem, height: props.altImagem }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>{props.textoBotao}</Text>

            </TouchableOpacity>
        </View>

    )
}


function telaIdadeMulher({ navigation }) {

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('idade'); return true });

    return (
        <ImageBackground source={FundoAgua} style={Estilos.fundo}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={Estilos.texto}>Idade:</Text>
                <OpcaoIdade aoClicar={() => { VarGlobais.glFaixaEtaria = 'ate17'; console.log('Faixa etaria escolhida: ' + VarGlobais.glFaixaEtaria); navigation.navigate('peso') }} CaminhoImagem={Adolescente} largImagem={53} altImagem={80} textoBotao='Até 17 anos' />
                <OpcaoIdade aoClicar={() => { VarGlobais.glFaixaEtaria = '18a55'; console.log('Faixa etaria escolhida: ' + VarGlobais.glFaixaEtaria); navigation.navigate('peso') }} CaminhoImagem={Adulta} largImagem={53} altImagem={80} textoBotao='18 a 55 anos' />
                <OpcaoIdade aoClicar={() => { VarGlobais.glFaixaEtaria = '56a65'; console.log('Faixa etaria escolhida: ' + VarGlobais.glFaixaEtaria); navigation.navigate('peso') }} CaminhoImagem={Velha} largImagem={53} altImagem={80} textoBotao='56 a 65 anos' />
                <OpcaoIdade aoClicar={() => { VarGlobais.glFaixaEtaria = '66ouMais'; console.log('Faixa etaria escolhida: ' + VarGlobais.glFaixaEtaria); navigation.navigate('peso') }} CaminhoImagem={MuitoVelha} largImagem={53} altImagem={80} textoBotao='maior que 65' />
            </View>
        </ImageBackground>

    )

}

export {
    telaIdadeMulher,
}



const Estilos = StyleSheet.create({

    idade: {
        display: 'flex',
        flexDirection: 'row',
        width: '60%',
        height: 90,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderWidth: 5,
        borderColor: '#A9A9A9',
        borderBottomEndRadius: 0,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#ADD8E6',
        marginBottom: 5,
    },

    fundo: {
        flex: 1,
        justifyContent: 'center',
    },

    texto: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    }


})


