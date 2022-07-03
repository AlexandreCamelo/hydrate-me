import React, { useState, useEffect } from 'react';
import { Text, View, BackHandler, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, StatusBar, Modal, SafeAreaView, Platform } from 'react-native';
import VarGlobais from '../../Global';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import { pegarMetaDiaria, pegarMlCopo, mudarPorcaoAgua } from '../BD/tabDadosUsuario';
import { incluirMlBebidos, pegarMlsBebidos, excluirUltimoRegistro } from '../BD/tabBebidos';
import { Image } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Copo from '../imagens/copoTransp.png'
import Garrafa from '../imagens/garrafa.png'
import Garrafao from '../imagens/garrafao.png'
import BotaoMenos from '../imagens/botaoMenosBranco.png'
import BotaoMais from '../imagens/botaoMaisBranco.png'
import Redefinir from '../imagens/setasCimaBaixoBrancas.png'
import { parseISO, format, formatRelative, formatDistance, isAfter, eachMinuteOfInterval } from 'date-fns';



import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
} from 'expo-ads-admob'



// async function ativaTestes() {
//     await setTestDeviceIDAsync('EMULATOR');

// }


//ativaTestes();


function telaPrincipal({ navigation }) {

    const [metaDiaria, setMetaDiaria] = useState(0);
    const [mlBebidos, setMlBebidos] = useState(0);
    const [mlCopo, setMlCopo] = useState(0);
    const [porcentagemBebida, setPorcentagemBebida] = useState(0.0);
    const [mostraMudarML, setMostraMudarML] = useState(false);
    const [anuncioAndroid, setAnuncioAndroid] = useState(false);

    var bebidosGlobal = 0;


    async function defineMlBebidos() {
        var bebidos = await pegarMlsBebidos(false);
        console.log('Bebidos na função é: ' + bebidos)
        setMlBebidos(bebidos);
        bebidosGlobal = bebidos;
        console.log('Definindo ML bebidos...: ' + bebidos);
        return bebidos;
    }

    async function qualAMetaDiaria() {
        var meta = await pegarMetaDiaria();
        VarGlobais.glMetaMililitros = meta;
        console.log('Peguei a meta diária na tela principal: ' + meta);
        setMetaDiaria(meta);
        console.log('Definindo meta diária...: ' + meta);


        //mudando porcentagem do círculo de progresso
        // var porcent = bebidosGlobal / VarGlobais.glMetaMililitros;
        var porcent = bebidosGlobal / VarGlobais.glMetaMililitros * 100;
        setPorcentagemBebida(porcent);
        console.log('O porcentual é: ' + porcent);
        console.log('O porcentual no useState é: ' + porcentagemBebida);



        return meta;
    }


    async function defineTamanhoCopo() {
        var ml = await pegarMlCopo();
        console.log('Os MLs do copo são: ' + ml)
        setMlCopo(ml);
    }


    async function mudaPorcaoAtual(ml) {
        mudarPorcaoAgua(ml);
        var ml = await pegarMlCopo();
        console.log('Os MLs do copo são: ' + ml)
        setMlCopo(ml);
    }




    useEffect(() => {
        //DEVE-SE usar uma variável booleana, no início de todo useEffect, para evitar o reinício repetido
        //de tudo o que estiver dentro dele e, TAMBÉM, para evitar o erro de TENTATIVA DE REGISTRO DE DUAS
        //TELAS COM O MESMO NOME.
        let executar = true;
        var aoFocalizar;

        if (executar) {

            if (Platform.OS == 'ios') {
                setAnuncioAndroid(false);
            } else {
                setAnuncioAndroid(true);
            }

            //Listener para atualizar os dados da tela, sempre que ela receber foco
            aoFocalizar = navigation.addListener('focus', () => {
                console.log('&&&&&&&&&&&&&&&&&&&&&&& FOCO NA TEL PRINCIPAL!!! &&&&&&&&&&&&&&&&&&&&&&&&');
                defineMlBebidos();
                qualAMetaDiaria();
            });


            defineMlBebidos();
            qualAMetaDiaria();
            defineTamanhoCopo();
        }

        return () => {
            executar = false;
            aoFocalizar;
        }
    }, [navigation]);


    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('telaPrinc'); return true });


    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>

                <StatusBar
                    backgroundColor='#006699'
                />


                <AnimatedCircularProgress
                    size={300}
                    width={20}
                    fill={porcentagemBebida}
                    tintColor="#00e0ff"
                    backgroundColor="#3d5875"
                    rotation={0}
                >
                    {
                        () => (
                            <>
                                <Text style={{ fontSize: 25, color: '#FFF', fontWeight: 'bold' }}>{mlBebidos + ' ml'}</Text>
                                <Text style={{ fontSize: 18, color: '#FFF' }}>{'Meta diária: ' + metaDiaria + ' ml'}</Text>
                            </>
                        )
                    }
                </AnimatedCircularProgress>


                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { setMostraMudarML(true) }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: '#FFF' }}>{mlCopo + ' ml'}</Text>
                        <Image
                            source={Copo}
                            style={{ width: 70, height: 101 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />



                        <Image
                            source={Redefinir}
                            style={{ width: 40, height: 32 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />


                    </View>

                </TouchableOpacity>


                <View style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>

                    <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { decrementaML() }}>
                        <Image
                            source={BotaoMenos}
                            style={{ width: 90, height: 90 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => incrementaML(mlCopo)}>
                        <Image
                            source={BotaoMais}
                            style={{ width: 90, height: 90 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </TouchableOpacity>

                </View>
                <ModalMudaML />

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

        </View >

    )



    function erroBanner() {
        return (
            <View>
                <Text>...</Text>
            </View>
        )
    }




    async function incrementaML(qtde) {
        var dataCompleta = new Date(Date.now());
        var agoraNum = dataCompleta.getTime();
        var agoraDataUs = format(dataCompleta, 'yyyy-MM-dd');
        var hora = format(dataCompleta, 'hh:mm');
        var diaSemNum = dataCompleta.getDay();
        incluirMlBebidos(agoraNum, agoraDataUs, hora, diaSemNum, qtde).then(
            async () => {
                var mlGuardados = await pegarMlsBebidos(true);
                console.log('mlGuardados = ' + mlGuardados)
                mlGuardados = Math.round(mlGuardados)
                mlGuardados = parseInt(mlGuardados);
                setMlBebidos(mlGuardados);

                var porcent = mlGuardados / VarGlobais.glMetaMililitros * 100;
                setPorcentagemBebida(porcent);
                console.log('O porcentual é: ' + porcent);
                console.log('O porcentual no useState é: ' + porcentagemBebida);
                console.log('ML GLOBAIS BEBIDOS: ' + mlGuardados);
            }
        );
        return true;
    }


    async function decrementaML() {
        excluirUltimoRegistro().then(
            async () => {
                var mlGuardados = await pegarMlsBebidos(true);
                console.log('mlGuardados = ' + mlGuardados)
                mlGuardados = Math.round(mlGuardados)
                mlGuardados = parseInt(mlGuardados);
                setMlBebidos(mlGuardados);

                var porcent = mlGuardados / VarGlobais.glMetaMililitros * 100;
                setPorcentagemBebida(porcent);
                console.log('O porcentual é: ' + porcent);
                console.log('O porcentual no useState é: ' + porcentagemBebida);
                console.log('ML GLOBAIS BEBIDOS: ' + mlGuardados);
            }
        );
        return true;
    }












    function ModalMudaML() {
        return (
            <SafeAreaView>
                <Modal
                    visible={mostraMudarML}
                    transparent={true}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'

                    }}>

                    <View
                        style={{
                            marginTop: '50%',
                            padding: 20,
                            backgroundColor: '#B0C4DE',
                            borderColor: '#FFF',
                            borderWidth: 10,
                            width: '100%'
                        }}>
                        <View style={{ width: '100%' }}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>


                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(100); }}>
                                    <Text style={{ display: 'flex', textAlign: 'auto' }}>100 ml</Text>
                                    <Image
                                        source={Copo}
                                        style={{ width: 50, height: 72 }}

                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(200); }}>
                                    <Text style={{ textAlign: 'center' }}>200 ml</Text>
                                    <Image
                                        source={Copo}
                                        style={{ width: 60, height: 87 }}
                                        PlaceholderContent={<ActivityIndicator />}

                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(250); }}>
                                    <Text style={{ textAlign: 'center' }}>250 ml</Text>
                                    <Image
                                        source={Copo}
                                        style={{ width: 70, height: 102 }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(300); }}>
                                    <Text style={{ textAlign: 'center' }}>300 ml</Text>
                                    <Image
                                        source={Copo}
                                        style={{ width: 80, height: 117 }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '95%', marginTop: 20 }}>

                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(500); }}>
                                    <Text style={{ textAlign: 'center' }}>500 ml</Text>
                                    <Image
                                        source={Garrafa}
                                        style={{ width: 80, height: 163 }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setMostraMudarML(false); mudaPorcaoAtual(1000); }}>
                                    <Text style={{ textAlign: 'center', marginBottom: 0 }}>1000 ml</Text>
                                    <Image
                                        source={Garrafao}
                                        style={{ width: 80, height: 163, marginTop: 0 }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>


                    </View>

                </Modal>
            </SafeAreaView>
        )
    }


















}

export {
    telaPrincipal,
}



const Estilos = StyleSheet.create({
    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around',
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