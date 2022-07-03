import React, { useState, useEffect } from 'react';
import FundoAgua from '../imagens/fundoAgua4.jpg';

import {
    Text, View, StyleSheet, ImageBackground, Dimensions
} from 'react-native';

import {
    StackedBarChart,
} from 'react-native-chart-kit';

import { agrupaBebidosPorData } from '../BD/tabBebidos';
import VarGlobais from '../../Global';

import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
} from 'expo-ads-admob'



function telaDashBoard({ navigation }) {


    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [diasGrafico, setDiasGrafico] = useState([]);
    const [mediaBebido, setMediaBebido] = useState(0);
    const [anuncioAndroid, setAnuncioAndroid] = useState(false);


    const data = {
        labels: diasGrafico,
        legend: [],
        data: dadosGrafico,
        barColors: ['#57A4FF'],
    };



    const chartConfig = {
        backgroundGradientFrom: "#FFF",
        backgroundGradientTo: "#FFF",

        //decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },

    }

    const dimensoes = (Dimensions.get("window").width)
    var largura = dimensoes;
    // var largura = dimensoes * 95 / 100;




    useEffect(() => {
        let executar = true;
        var aoFocalizar;

        if (executar) {
            //Listener para atualizar os dados da tela, sempre que ela receber foco
            aoFocalizar = navigation.addListener('focus', () => {
                atualizaTodosOsDados();
            });

            atualizaTodosOsDados();

            if (Platform.OS == 'ios') {
                setAnuncioAndroid(false);
            } else {
                setAnuncioAndroid(true);
            }
        }

        return () => {
            executar = false;
            aoFocalizar;
        }
    }, [navigation]);






    //style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>
                <View style={{ display: 'flex', alignItems: 'center', marginTop: 30}}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FFF' }}>INGESTÃO DE ÁGUA NOS ÚLTIMOS 7 DIAS</Text>

                    <StackedBarChart

                        yLabelsOffset={1}
                        segments={5}
                        data={data}
                        width={largura}
                        height={300}
                        chartConfig={chartConfig}


                        style={Estilos.grafico}
                        formatYLabel={(y) => {
                            var num = y;
                            num = parseInt(num);
                            num = num.toString();
                            return num;
                        }}
                    />



                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{'Meta diária: ' + VarGlobais.glMetaMililitros + " ml"}</Text>

                    {
                        mediaBebido > 0 ?
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FFF' }}>{'Média: ' + mediaBebido + " ml"}</Text>
                            :
                            null
                    }
                </View>
                
                
                
               {/* BANNER PROPAGANDA GOOGLE (DE ACORDO COM O SISTEMA OPERACIONAL) */}
               {anuncioAndroid ?
                    <AdMobBanner style={{ marginTop: 5 }}
                        bannerSize="smartBannerPortrait"
                        adUnitID="ca-app-pub-5442077179974899/4104035696" // Test ID, Replace with your-admob-unit-id
                        servePersonalizedAds // true or false
                    />

                    :

                    <AdMobBanner style={{ marginTop: 5 }}
                        bannerSize="smartBannerPortrait"
                        adUnitID="ca-app-pub-5442077179974899/5856951125" // Test ID, Replace with your-admob-unit-id
                        servePersonalizedAds // true or false
                    />

                }

            </ImageBackground>

        </View>

    )




    function erroBanner() {
        return (
            <View>
                <Text>...</Text>
            </View>
        )
    }



    async function colocaArraysDentroDoArray(conteudo) {
        var arrayCheioDeArrays = [];

        var tudo = [];
        tudo = JSON.stringify(conteudo);
        tudo = JSON.parse(JSON.stringify(conteudo));

        for (var linha = 0; linha < tudo.length; linha++) {
            var arrayPraBotarDentroDoArray = [];
            arrayPraBotarDentroDoArray.push(tudo[linha].ml_bebidos);
            arrayCheioDeArrays.push(arrayPraBotarDentroDoArray);
        }

        return arrayCheioDeArrays;

    }


    async function pegaDiasGrafico(conteudo) {
        var arrayComDias = [];
        var tudo = [];
        tudo = JSON.stringify(conteudo);
        tudo = JSON.parse(JSON.stringify(conteudo));

        for (var linha = 0; linha < tudo.length; linha++) {
            var dataNumerica = 0;
            dataNumerica = tudo[linha].data_numerica;
            var data = new Date(dataNumerica);
            var dia = data.getDate();
            var mes = data.getMonth() + 1;
            arrayComDias.push(dia + '/' + formataNumMes(mes));
        }

        return arrayComDias;

    }


    async function atualizaTodosOsDados() {
        var conteudo = [];
        conteudo = await agrupaBebidosPorData();

        var arrayComDias = [];
        var arrayCheioDeArrays = [];
        var somaBebidos = 0;
        var totalDeDias = 0;

        var tudo = [];
        tudo = JSON.stringify(conteudo);
        tudo = JSON.parse(JSON.stringify(conteudo));

        for (var linha = 0; linha < tudo.length; linha++) {
            totalDeDias++;
            somaBebidos += tudo[linha].ml_bebidos;
            console.log("77777777777777777777 O TOTAL DE DIAS SEMPRE SERÁ: " + totalDeDias);

            var dataNumerica = 0;
            dataNumerica = tudo[linha].data_numerica;
            var data = new Date(dataNumerica);
            var dia = data.getDate();
            var mes = data.getMonth() + 1;
            arrayComDias.push(dia + '/' + formataNumMes(mes));


            var arrayPraBotarDentroDoArray = [];
            arrayPraBotarDentroDoArray.push(tudo[linha].ml_bebidos);
            arrayCheioDeArrays.push(arrayPraBotarDentroDoArray);


        }



        setDiasGrafico(arrayComDias);
        setDadosGrafico(arrayCheioDeArrays);
        setMediaBebido(parseInt(somaBebidos / totalDeDias));


        return true;

    }
















    function formataNumMes(numero) {

        if (numero < 10) {
            numero = '0' + numero;
        }

        return numero
    }







}


export {
    telaDashBoard,
}





const Estilos = StyleSheet.create({
    grafico: {
        borderRadius: 10,
        // backgroundColor: '#ADD8E6',
        borderColor: '#778899',
        borderWidth: 3,
        marginLeft: 10,
        marginRight: 10,
        paddingRight: 10,
        // fontSize: 50,
        // fontWeight: 'bold',
        // color: '#696969',
        // textAlign: 'center',
        // paddingLeft: 5,
        // paddingRight: 5,
    },

    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    texto: {

        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
















})


