import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, BackHandler, Alert } from 'react-native';
import VarGlobais from '../../Global'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native-elements';
import Relogio from '../imagens/relogio.png';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { pegaHora } from '../../funcoes/GeracaoAlarmes';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import Acordar from '../imagens/acordarMenor.png';



function telaAcordar({ navigation }) {
    const [mostraRelogioAcordar, setMostraRelogioAcordar] = useState(false);
    const [horaAcordar, setHoraAcordar] = useState(new Date(Date.now()));
    const [acordar, setAcordar] = useState('');

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('acordar'); return true });


    function criarAlerta() {
        Alert.alert(
            "Informação necessária",
            "A hora de acordar é necessária.\n\nQuer sair do app?",
            [
                {
                    text: "Sim",
                    onPress: () => navigation.navigate('finalizado'),
                    style: "cancel"
                },
                { text: "Não", onPress: () => setMostraRelogioAcordar(true), style: 'destructive' }
            ]
        );

    }



    //########################################################################################
    //CONTROLES DO PICKER DA HORA DE ACORDAR

    async function onChangeAcordar(date) {
        if (date == null) {
            return;
        }

        if (await AsyncStorage.getItem('horaAcordar') == null) {
            await AsyncStorage.setItem('horaAcordar', '');
        }
        await AsyncStorage.setItem('horaAcordar', date.getHours().toString());

        if (await AsyncStorage.getItem('horaAcordarFormatoHora') == null) {
            await AsyncStorage.setItem('horaAcordarFormatoHora', '');
        }
        await AsyncStorage.setItem('horaAcordarFormatoHora', date.toString());

        setHoraAcordar(date);
        setAcordar(pegaHora(date, true));
        VarGlobais.glHoraAcordarFormatoHora = date;
        VarGlobais.glHoraAcordar = date.getHours();
        setMostraRelogioAcordar(false);
        console.log('DATA/HORA DE ACORDAR: ' + VarGlobais.glHoraAcordarFormatoHora);
        console.log('STORAGE DATA/HORA DE ACORDAR: ' + await AsyncStorage.getItem('horaAcordar'));
        navigation.navigate('dormir');

    };

    //########################################################################################


    return (
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ImageBackground source={FundoAgua} style={Estilos.fundo}>
            
            <View style={{ display:'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={Acordar}
                style={{ width: 200, height: 150, marginTop: 10 }}
                PlaceholderContent={<ActivityIndicator />}
            />


                <Text style={Estilos.texto}>Hora de acordar</Text>
                <TouchableOpacity
                    style={Estilos.botaoRelogio}
                    activeOpacity={0.0}
                    onPress={() => setMostraRelogioAcordar(true)}>
                    <Image
                        source={Relogio}
                        style={{ width: 120, height: 120 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </TouchableOpacity>


            </View>

            {/*Picker da hora de acordar*/}
            <DateTimePickerModal
                headerTextIOS="Hora de acordar"
                isVisible={mostraRelogioAcordar}
                mode="time"
                onConfirm={onChangeAcordar}
                onCancel={() => {
                    setMostraRelogioAcordar(false);
                    criarAlerta()
                }}
                style={{ width: 400 }}
            >

            </DateTimePickerModal>








        </ImageBackground>
        // </View>
    )
}

export {
    telaAcordar,
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
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'repeat',
       
    },

    texto: {
        borderRadius: 10,
        backgroundColor: '#ADD8E6',
        borderColor: '#778899',
        borderWidth: 3,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#696969',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    }


})


