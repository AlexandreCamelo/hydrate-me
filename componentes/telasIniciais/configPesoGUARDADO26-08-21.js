import React, { useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator, Switch, Alert, BackHandler, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import Balanca from '../imagens/balanca.png';
import SetaDireita from '../imagens/setaDireita.png';
import { Image } from 'react-native-elements';
import VarGlobais from '../../Global'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundoAgua from '../imagens/fundoAgua4.jpg';

function telaPeso({ navigation }) {

    const [peso, setPeso] = useState(0);
    const [libras, setLibras] = useState(false);

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('peso'); return true });




    async function aoClicarOk() {
        if (peso === 0 || peso == null) {
            criarAlerta();
            return;
        }
        VarGlobais.glPeso = peso;
        await AsyncStorage.setItem('peso', peso.toString());
        console.log('Peso escolhido var global: ' + VarGlobais.glPeso);
        console.log('Peso escolhido storage: ' + await AsyncStorage.getItem('peso'));
        navigation.navigate('acordar')
    }


    function sair() {

        navigation.navigate('finalizado')
    }


    function criarAlerta() {
        Alert.alert(
            "Informação necessária",
            "O peso é necessário.\n\nQuer sair do app?",
            [
                {
                    text: "Sim",
                    onPress: () => navigation.navigate('finalizado'),
                    style: "cancel"
                },
                {
                    text: "Não",
                    onPress: () => { return },
                    style: "destructive"
                }
            ]
        );

    }

    //, justifyContent: 'center', alignItems: 'flex-start'
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1, width: '100%' }}
            keyboardVerticalOffset={Platform.OS == 'ios' ? 100 : 100}

        >
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>

                <View>
                    <Text style={Estilos.texto}>Seu peso:</Text>
                    <Image
                        source={Balanca}
                        style={{ width: 200, height: 200, borderWidth: 2, borderColor: '#c0c0c0', marginBottom: 50 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <InputSpinner
                        max={500}
                        min={0}
                        step={1}
                        colorMax={"#f04048"}
                        colorMin={"#40c5f4"}
                        value={peso}
                        onChange={(num) => setPeso(num)}
                        onIncrease={() => Keyboard.dismiss()}
                        onDecrease={() => Keyboard.dismiss()}
                        skin='square'
                        width={300}
                        height={100}
                        fontSize={30}
                        fontWeight='bold'
                    />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 3, borderColor: '#778899', borderWidth: 3, borderRadius: 10, backgroundColor: '#ADD8E6', marginBottom: 30 }}>
                    <Text style={Estilos.textoKg}>kg</Text>
                    <Switch
                        style={{ marginLeft: 5, marginRight: 5 }}
                        value={libras}
                        onValueChange={(valor) => {
                            setLibras(valor);
                            if (valor) {
                                setPeso(peso * 2.20462)
                            } else {
                                setPeso(peso / 2.20462)
                            }
                        }}
                    />
                    <Text style={Estilos.textoKg}>lbs</Text>
                </View>

                <TouchableOpacity
                    style={Estilos.peso}
                    activeOpacity={0.0}
                    onPress={() => aoClicarOk()}>

                    <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#696969', marginRight: 10 }}>Ok</Text>
                    <Image
                        transition={true}
                        transitionDuration='500'
                        source={SetaDireita}
                        style={{ width: 120, height: 80 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />


                </TouchableOpacity>
            </ImageBackground>
        </KeyboardAvoidingView>



    )

}

export {
    telaPeso,
}


const Estilos = StyleSheet.create({

    peso: {
        display: 'flex',
        flexDirection: 'row',
        width: '55%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderWidth: 5,
        borderColor: '#778899',
        borderRadius: 10,
        //padding: 5,
        backgroundColor: '#ADD8E6',
    },

    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        resizeMode: 'repeat',
        paddingTop: 10,
        paddingBottom: 10,
    },

    texto: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },

    textoKg: {
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: '#ADD8E6',
        borderRadius: 10,
    }
})
