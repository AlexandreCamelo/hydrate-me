import React, { useState } from 'react';
import {
    Text, View, ImageBackground, StyleSheet, TouchableOpacity,
    ActivityIndicator, Switch, Alert, BackHandler,
    KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TextInput, Button
} from 'react-native';
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

    return (

        <ImageBackground source={FundoAgua} style={Estilos.fundo}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>


                    <Text style={Estilos.texto}>Seu peso:</Text>

                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        <InputSpinner
                            max={500}
                            min={0}
                            step={1}
                            colorMax={"#f04048"}
                            colorMin={"#FFF"}
                            background={'#708090'}
                            colorPress='#00BFFF'
                            textColor='#FFF'
                            value={peso}
                            onChange={(num) => setPeso(num)}
                            onIncrease={() => Keyboard.dismiss()}
                            onDecrease={() => Keyboard.dismiss()}
                            skin='square'
                            width={300}
                            height={80}
                            fontSize={50}
                            fontWeight='bold'
                            color='#FFF'
                            buttonFontSize={50}
                            buttonStyle={{ borderRadius: 10 }}
                            style={{ borderRadius: 10 }}
                        />

                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 3, borderColor: '#778899', borderWidth: 3, borderRadius: 10, backgroundColor: '#ADD8E6', marginBottom: 10, width: '50%', alignItems: 'center' }}>
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


                    </View>



                    <TouchableOpacity
                        style={Estilos.peso}
                        activeOpacity={0.0}
                        onPress={() => aoClicarOk()}>

                        <Image
                            source={SetaDireita}
                            style={{ width: 120, height: 80 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />

                        <Image
                            source={Balanca}
                            style={{ width: 200, height: 200, borderWidth: 2, borderColor: '#c0c0c0', marginTop: 50 }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </TouchableOpacity>





                </View>


            </TouchableWithoutFeedback>
        </ImageBackground >





    )

}

export {
    telaPeso,
}


const Estilos = StyleSheet.create({

    peso: {
        display: 'flex',
        alignItems: 'center',
        width: '55%',
        marginTop: 20,
    },

    fundo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    texto: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },

    textoKg: {
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: '#ADD8E6',
        borderRadius: 10,
    },





})
