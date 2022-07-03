import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, BackHandler, Alert } from 'react-native';
import VarGlobais from '../../Global'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerModal as DateTimeP } from "react-native-modal-datetime-picker";
import { pegaHora } from '../../funcoes/GeracaoAlarmes';
import { Image } from 'react-native-elements';
import Relogio from '../imagens/relogio.png';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import Dormir from '../imagens/dormirTransp.png';


function telaDormir({ navigation }) {
    const [mostraRelogioDormir, setMostraRelogioDormir] = useState(false);
    const [horaDormir, setHoraDormir] = useState(new Date(Date.now()));
    const [dormir, setDormir] = useState('');

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('dormir'); return true });


    function criarAlerta() {


        Alert.alert(
            "Informação necessária",
            "A hora de dormir é necessária.\n\nQuer sair do app?",
            [
                {
                    text: "Sim",
                    onPress: () => navigation.navigate('finalizado'),
                    style: "cancel"
                },
                {
                    text: "Não",
                    onPress: () => setMostraRelogioDormir(true),
                    style: "destructive"
                }
            ]
        );

    }





    function alertaDormirAcordar(aviso) {
        Alert.alert(
            "Horas inconsistentes",
            aviso,
            [
                {
                    text: "Entendi",
                    onPress: () => setMostraRelogioDormir(true),
                    style: "destructive"
                }
            ]
        );
    }


    //########################################################################################
    //CONTROLES DO PICKER DA HORA DE ACORDAR
    async function onChangeDormir(date) {
        if (date == null) {
            return;
        }

        if (await AsyncStorage.getItem('horaDormir') == null) {
            await AsyncStorage.setItem('horaDormir', '');
        }

        await AsyncStorage.setItem('horaDormir', date.getHours().toString());

        if (await AsyncStorage.getItem('horaDormirFormatoHora') == null) {
            await AsyncStorage.setItem('horaDormirFormatoHora', '');
        }
        await AsyncStorage.setItem('horaDormirFormatoHora', date.toString());

        var diferencaDormirAcordar = (date - VarGlobais.glHoraAcordarFormatoHora.getTime()) / 3600000;


        //A diferença entre dormir e acordar deve ser de, NO MÍNIMO, 2 horas,
        //do contrário, existirá 'erro de range' 
        if (diferencaDormirAcordar < 2 && diferencaDormirAcordar >= 0) {
            setMostraRelogioDormir(false);
            alertaDormirAcordar("A diferença entre a HORA DE DORMIR e a HORA DE ACORDAR deve ser de, no mínimo 2 HORAS.");
            return;
        }else if (diferencaDormirAcordar < 0 ) {
            setMostraRelogioDormir(false);
            alertaDormirAcordar("A HORA DE ACORDAR deve ser MENOR que a HORA DE DORMIR.");
            return;
        }

        setHoraDormir(date);
        setDormir(pegaHora(date, true));
        VarGlobais.glHoraDormirFormatoHora = date;
        VarGlobais.glHoraDormir = parseInt(date.getHours().toFixed(0));
        setMostraRelogioDormir(false);

        console.log('DATA/HORA DE DORMIR: ' + VarGlobais.glHoraDormirFormatoHora);
        console.log('STORAGE DATA/HORA DE DORMIR: ' + await AsyncStorage.getItem('horaDormir'));

        navigation.navigate('progresso');

    };




    function texto() {
        return (

            <View>

                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>OPA</Text>
            </View>

        )
    }
    //########################################################################################


    return (
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ImageBackground source={FundoAgua} style={Estilos.fundo}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Image
                    source={Dormir}
                    style={{ width: 200, height: 121, marginBottom: 10 }}
                    PlaceholderContent={<ActivityIndicator />}
                />
                <Text style={Estilos.texto}>Hora de dormir</Text>
                <TouchableOpacity
                    style={Estilos.botaoRelogio}
                    activeOpacity={0.0}
                    onPress={() => setMostraRelogioDormir(true)}>
                    <Image
                        source={Relogio}
                        style={{ width: 120, height: 120 }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </TouchableOpacity>


            </View>
            {/*Picker da hora de dormir*/}
            <DateTimeP
                headerTextIOS="Hora de dormir"
                isVisible={mostraRelogioDormir}
                mode="time"
                onConfirm={onChangeDormir}
                onCancel={() => {
                    setMostraRelogioDormir(false);
                    criarAlerta()
                }}
                style={{ width: 400 }}
            >
            </DateTimeP>



        </ImageBackground>
        // </View>
    )
}


export {
    telaDormir,
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
        padding: 5,
        backgroundColor: '#ADD8E6',
    },

    fundo: {
        flex: 1,
        justifyContent: 'center',
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


