import React from 'react';
import { LogBox, View, ScrollView } from 'react-native';
import BotoesAlarmes from '../componentes/compBotoesAlarmes'

//Desativa as caixas amarelas de 'WARNINGS'
LogBox.ignoreAllLogs(true);

export default function App(props) {
    return (

        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <View style={{ display: 'flex', marginBottom: 20, alignItems: 'center', width: '100%', paddingTop: 20 }}>

                    <BotoesAlarmes numeroDia={1} />
                    <BotoesAlarmes numeroDia={2} />
                    <BotoesAlarmes numeroDia={3} />
                    <BotoesAlarmes numeroDia={4} />
                    <BotoesAlarmes numeroDia={5} />
                    <BotoesAlarmes numeroDia={6} />
                    <BotoesAlarmes numeroDia={7} />
                </View>
            </ScrollView>
        </View>

    );




}

