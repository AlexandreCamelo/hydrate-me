import React, { useState, useEffect } from 'react';
import {
    Text, View, StyleSheet, ActivityIndicator,
    TouchableOpacity, ImageBackground, BackHandler,
    Alert, Modal, Button, SafeAreaView
} from 'react-native';
import { Image } from 'react-native-elements';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import Redefinir from '../imagens/redefPequeno.png'
import ExcluirEstatisticas from '../imagens/excluirEstatMenor.png'
import { limparInformacoesUsuario, pegarDadosDoUsuario } from '../BD/tabDadosUsuario'
import { limpaTabelaBebidos } from '../BD/tabBebidos';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

function telaDashBoard({ navigation }) {

    // const [mostrar, setMostrar] = useState(false);
    // const [mostrarAvisoHistorico, setMostrarAvisoHistorico] = useState(false);
    // const [mostrarConfHistorico, setMostrarConfHistorico] = useState(false);
    // const [sexo, setSexo] = useState('');
    // const [idade, setIdade] = useState('');
    // const [peso, setPeso] = useState(0);
    // const [horaAcordar, setHoraAcordar] = useState('');
    // const [horaDormir, setHoraDormir] = useState('');
    // const [metaDiaria, setMetaDiaria] = useState(0);








    // useEffect(() => {

    //     let executar = true;

    //     if (executar) {
    //         pegaDados();

    //     }

    //     return () => {
    //         executar = false;

    //     };
    // }, []);





    // async function pegaDados() {
    //     var dados = await pegarDadosDoUsuario()
    //     setSexo(dados[0].sexo);
    //     setPeso(dados[0].peso);
    //     setIdade(pegaFaixaEtaria(dados[0].idade));
    //     setHoraAcordar(dados[0].hora_acordar);
    //     setHoraDormir(dados[0].hora_dormir);
    //     setMetaDiaria(dados[0].meta_ml);
    // }
    const fill = '#FFF'
    // const data = [10, 20, 30, -10]
    const data = [

        {
            dia: 'segunda',
            ml: 1000,
        },

        {
            dia: 'terça',
            ml: 1250,
        },

        {
            dia: 'quarta',
            ml: 1450,
        },




    ]


    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', width: '100%' }}>

            <ImageBackground source={FundoAgua} style={Estilos.fundo}>


                <BarChart
                    style={{ height: 200, borderColor: '#FFF', borderWidth: 1, width: '95%', marginTop: 50 }}
                    data={data}
                    // xAccessor={({item}) => item}
                   // yAccessor={({item}) => data[index].ml}
                    svg={{ fill }}
                    contentInset={{ top: 30, bottom: 30 }


                    }>

                    <Grid />

                    <XAxis
                        style={{ marginHorizontal: -10 }}
                        data={data.dia}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 50, right: 50 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                        //xAccessor={({item}) => item.dia}
                    />
                </BarChart>


            </ImageBackground>
        </View>
    )


}

export {
    telaDashBoard,
}


const Estilos = StyleSheet.create({
    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',

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

