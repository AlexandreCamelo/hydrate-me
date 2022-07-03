import React, { useState, useEffect } from 'react';
import {
    Text, View, StyleSheet, ActivityIndicator,
    TouchableOpacity, ImageBackground, Platform,
    Modal, SafeAreaView
} from 'react-native';
import { Image } from 'react-native-elements';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import Redefinir from '../imagens/redefPequeno.png'
import ExcluirEstatisticas from '../imagens/excluirEstatMenor.png'
import { limparInformacoesUsuario, pegarDadosDoUsuario } from '../BD/tabDadosUsuario'
import { limpaTabelaBebidos } from '../BD/tabBebidos';
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

function telaAjustes({ navigation }) {

    const [mostrar, setMostrar] = useState(false);
    const [mostrarAvisoHistorico, setMostrarAvisoHistorico] = useState(false);
    const [mostrarConfHistorico, setMostrarConfHistorico] = useState(false);
    const [sexo, setSexo] = useState('');
    const [idade, setIdade] = useState('');
    const [peso, setPeso] = useState(0);
    const [horaAcordar, setHoraAcordar] = useState('');
    const [horaDormir, setHoraDormir] = useState('');
    const [metaDiaria, setMetaDiaria] = useState(0);
    const [anuncioAndroid, setAnuncioAndroid] = useState(false);



    useEffect(() => {

        let executar = true;

        if (executar) {
            pegaDados();

            if (Platform.OS == 'ios') {
                setAnuncioAndroid(false);
            } else {
                setAnuncioAndroid(true);
            }




        }

        return () => {
            executar = false;

        };
    }, []);





    async function pegaDados() {
        var dados = await pegarDadosDoUsuario()
        setSexo(dados[0].sexo);
        setPeso(dados[0].peso);
        setIdade(pegaFaixaEtaria(dados[0].idade));
        setHoraAcordar(dados[0].hora_acordar);
        setHoraDormir(dados[0].hora_dormir);
        setMetaDiaria(dados[0].meta_ml);
    }





    function pegaFaixaEtaria(faixa) {
        if (faixa === 'ate17') {
            return 'Até 17 anos';
        } else if (faixa === '18a55') {
            return 'Entre 18 e 55 anos';
        } else if (faixa === '56a65') {
            return 'Entre 56 e 65 anos';
        } else if (faixa === '66ouMais') {
            return '66 anos ou mais';
        }
    }






    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', width: '100%' }}>

            <ImageBackground source={FundoAgua} style={Estilos.fundo}>


                <View style={{ display: 'flex', alignItems: 'flex-start', borderWidth: 1, borderColor: '#FFF', borderRadius: 5, width: '95%', padding: 10, marginTop: 30 }}>
                    <Text style={{ color: '#FFF' }}>{'SEXO: ' + (sexo == 'M' ? 'Masculino' : 'Feminino')}</Text>
                    <Text style={{ color: '#FFF' }}>{'IDADE: ' + idade}</Text>
                    <Text style={{ color: '#FFF' }}>{'PESO: ' + peso + ' kg'}</Text>
                    <Text style={{ color: '#FFF' }}>{'HORA DE ACORDAR: ' + parseInt(horaAcordar) + ':00'}</Text>
                    <Text style={{ color: '#FFF' }}>{'HORA DE DORMIR: ' + parseInt(horaDormir) + ':00'}</Text>
                    <Text style={{ color: '#FFF' }}>{'META DIÁRIA: ' + metaDiaria + ' ml'}</Text>
                </View>





                <TouchableOpacity style={Estilos.genero} activeOpacity={0.0} onPress={() => setMostrar(true)}>
                    <Image
                        source={Redefinir}
                        style={{ width: 50, height: 48 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    <View style={{ display: 'flex' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Mudar suas</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>informações</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={Estilos.genero} activeOpacity={0.0} onPress={() => setMostrarAvisoHistorico(true)}>
                    <Image
                        source={ExcluirEstatisticas}
                        style={{ width: 90, height: 68 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />

                    <View style={{ display: 'flex' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Excluir</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>histórico</Text>
                    </View>

                </TouchableOpacity>




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


                <Aviso />
                <AvisoExcluirHistorico />
                <AvisoConfirmacaoHistorico />


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




    function Aviso() {
        return (
            <SafeAreaView>
                <Modal
                    visible={mostrar}
                    transparent={true}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>

                    <View
                        style={{
                            marginTop: '50%',
                            marginLeft: 50,
                            marginRight: 50,
                            padding: 20,
                            backgroundColor: '#B0C4DE',
                            borderBottomColor: '#808080',
                            borderRightColor: '#808080',
                            borderBottomWidth: 10,
                            borderRightWidth: 10,
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomStartRadius: 10




                        }}>
                        <Text>{'Isso apagará suas informações pessoais e mudará os horários dos lembretes.\n\nQuer continuar?'}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={Estilos.simNao} activeOpacity={0.0} onPress={() => setMostrar(false)}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Não</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={Estilos.simNao}
                                activeOpacity={0.0}
                                onPress={() => {
                                    setMostrar(false);
                                    navigation.navigate('genero');
                                    limparInformacoesUsuario();
                                }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Sim</Text>
                            </TouchableOpacity>


                        </View>


                    </View>

                </Modal>
            </SafeAreaView>
        )
    }


    function AvisoExcluirHistorico() {
        return (
            <SafeAreaView>
                <Modal
                    visible={mostrarAvisoHistorico}
                    transparent={true}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>

                    <View
                        style={{
                            marginTop: '50%',
                            marginLeft: 50,
                            marginRight: 50,
                            padding: 20,
                            backgroundColor: '#B0C4DE',
                            borderBottomColor: '#808080',
                            borderRightColor: '#808080',
                            borderBottomWidth: 10,
                            borderRightWidth: 10,
                            borderTopRightRadius: 10,
                            borderBottomStartRadius: 10
                        }}>
                        <Text>{'Isso apagará todo o seu histórico de hidratação.\n\nConfirma?'}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={Estilos.simNao} activeOpacity={0.0} onPress={() => setMostrarAvisoHistorico(false)}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Não</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={Estilos.simNao}
                                activeOpacity={0.0}
                                onPress={() => {
                                    setMostrarAvisoHistorico(false);
                                    limpaTabelaBebidos();
                                    setMostrarConfHistorico(true);

                                }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969' }}>Sim</Text>
                            </TouchableOpacity>


                        </View>


                    </View>

                </Modal>
            </SafeAreaView>
        )
    }




    function AvisoConfirmacaoHistorico() {
        return (
            <SafeAreaView>
                <Modal
                    visible={mostrarConfHistorico}
                    transparent={true}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <View
                        style={{
                            marginTop: '50%',
                            marginLeft: 50,
                            marginRight: 50,
                            padding: 20,
                            backgroundColor: '#E9967A',
                            borderBottomColor: '#808080',
                            borderRightColor: '#808080',
                            borderBottomWidth: 10,
                            borderRightWidth: 10,
                            borderTopRightRadius: 10,
                            borderBottomStartRadius: 10
                        }}>
                        <Text style={{ fontSize: 15 }}>{'Seu histórico de hidratação foi excluído.'}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity style={Estilos.entendi} activeOpacity={0.0} onPress={() => { setMostrarConfHistorico(false); navigation.navigate('telaPrinc2') }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#696969' }}>Entendi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }


}

export {
    telaAjustes,
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
        width: '60%',
        height: 90,
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

    simNao: {
        display: 'flex',
        flexDirection: 'row',
        width: '40%',
        height: 50,
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

    entendi: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        height: 50,
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

    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around',
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


