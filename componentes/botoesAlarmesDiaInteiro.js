
import React, { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { LogBox, View, Text, Switch } from 'react-native';
import {  ativaDesativaDia } from './BD/tabDiasAtivos';
import { agendaAlarmesSemanais } from '../funcoes/GeracaoAlarmes'

//Desativa as caixas amarelas de 'WARNINGS'
LogBox.ignoreAllLogs(true);


export default function (props) {
    
    const [quandoAtivar, setQuandoAtivar] = useState(props.quandoATivar);

    return (

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{props.nomeDoDia}</Text>
            <Switch
                trackColor={{
                    false: '#CDCDCD',
                    true: '#FFF',
                }}

                thumbColor={props.quandoAtivar ? '#87CEFA' : '#FFF'}
                value={quandoAtivar}
                onChange={() => {

                    if (quandoAtivar) {
                        ativaDesativaDia(props.numeroDoDia, 'false');
                        setQuandoAtivar(false);
                        props.iniciaAlarmes();
                        for (var alarme = 0; alarme < props.diaState.length; alarme++) {
                            Notifications.cancelScheduledNotificationAsync(props.diaState[alarme].ident_alarme);
                            props.diaState[alarme].ativar = false;
                            console.log('DESATIVEI o alarme' + props.diaState[alarme].ident_alarme);
                        }
                    }else{
                        ativaDesativaDia(props.numeroDoDia, 'true');
                        setQuandoAtivar(true);
                        props.iniciaAlarmes();
                        for (var alarme = 0; alarme < props.diaState.length; alarme++) {
                            agendaAlarmesSemanais(props.diaState[alarme].dia, props.diaState[alarme].hora, props.diaState[alarme].minuto, props.diaState[alarme].ident_alarme);
                            props.diaState[alarme].ativar = true;
                            console.log('ATIVEI o alarme' + props.diaState[alarme].ident_alarme);
                        }
                    }

                }} />
        </View>

    )


}