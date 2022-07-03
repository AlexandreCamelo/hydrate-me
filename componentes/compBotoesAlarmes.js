import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { LogBox,  View, Text,  Switch } from 'react-native';
import { selecionarPorDia, ativaDesativaAlarme, ativaDesativaDia } from './BD/tabDiasAtivos';
import { agendaAlarmesSemanais } from '../funcoes/GeracaoAlarmes'

//Desativa as caixas amarelas de 'WARNINGS'
LogBox.ignoreAllLogs(true);



export default function App(props) {

    const [diaSemana, setDiaSemana] = useState([]);
    const [ativarDiaSemana, setAtivarDiaSemana] = useState(true);

    useEffect(() => {
        let executar = true;


        if (executar) {
            pegaAlarmesDoDia(props.numeroDia);
            //verificaDiaInteiroAtivado(arrayDeAlarmes);
        }

        return () => {
            executar = false;
        }

    }, []);


    async function pegaAlarmesDoDia(numeroDia) {
        var conteudo = [];
        console.log('Pegando alarmes do dia ' + numeroDia);
        conteudo = await selecionarPorDia(numeroDia);
        var tudo = [];
        tudo = JSON.stringify(conteudo);
        tudo = JSON.parse(JSON.stringify(conteudo));
        setDiaSemana(tudo);
        verificaDiaInteiroAtivado(tudo);
        return tudo;

    }

   
    function verificaDiaInteiroAtivado(matriz) {
        var quantosFALSE = 0;
        console.log('VERIFICANDO DIA INTEIRO ATIVADO. TAMANHO DA MATRIZ: ' + matriz.length);
        for (var alarme = 0; alarme < matriz.length; alarme++) {
            if (matriz[alarme].ativar == 'false') {
                quantosFALSE = quantosFALSE + 1;
            }
        }

        if (quantosFALSE == matriz.length) {
            setAtivarDiaSemana(false);
        } else {
            setAtivarDiaSemana(true);
        }
    }


    return (

        <View>
            {/* SWITCH DO DIA DA SEMANA */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{pegaDiaSemana(props.numeroDia)}</Text>
                <Switch
                    trackColor={{
                        false: '#CDCDCD',
                        true: '#FFF',
                    }}

                    thumbColor={ativarDiaSemana ? '#87CEFA' : '#FFF'}
                    value={ativarDiaSemana}
                    onChange={() => {
                        console.log('######################### O ESTADO DE ATIVAR DIA DA SEMANA É: ' + ativarDiaSemana)
                        if (ativarDiaSemana == true) {
                            console.log('######################### ENTÃO, ENTREI EM ATIVAR TRUE');
                            ativaDesativaDia(props.numeroDia, 'false');
                            setAtivarDiaSemana(false);
                            pegaAlarmesDoDia(props.numeroDia)
                            for (var alarme = 0; alarme < diaSemana.length; alarme++) {
                                Notifications.cancelScheduledNotificationAsync(diaSemana[alarme].ident_alarme);
                                diaSemana[alarme].ativar = false;
                                console.log('DESATIVEI o alarme' + diaSemana[alarme].ident_alarme);
                            }
                        } else {
                            console.log('######################### ENTÃO, ENTREI EM ATIVAR false');
                            ativaDesativaDia(props.numeroDia, 'true');
                            console.log('######################### QUAL É O PROPS.NÚMERO DO DIA? ' + props.numeroDia);

                            setAtivarDiaSemana(true);
                            pegaAlarmesDoDia(props.numeroDia);
                            for (var alarme = 0; alarme < diaSemana.length; alarme++) {
                                agendaAlarmesSemanais(diaSemana[alarme].dia, diaSemana[alarme].hora, diaSemana[alarme].minuto, diaSemana[alarme].ident_alarme);
                                diaSemana[alarme].ativar = true;
                                console.log('ATIVEI o alarme' + diaSemana[alarme].ident_alarme);
                            }
                        }

                    }} />
            </View>



            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 50, width: '82.8%' }}>




                {
                    diaSemana != null ?  //Foi necessário fazer esse teste, pois, de alguma maneira, o array estava ficando vazio e existia um grande erro, durante o carregamento do app
                        diaSemana.map((dia, index) => (


                            //No caso dos componentes gerados DINAMICAMENTE, cada um deles deve ter uma chave única (KEY)
                            //caso contrário, será apresentado no CONSOLE um warning. Nesse caso, em particular, usei o index
                            //do array, para gerar essa chave única                    
                            <View key={index} style={{ marginRight: 5, alignItems: 'center', borderColor: '#FFF', borderWidth: 1, paddingLeft: 2, paddingRight: 2 }}>


                                <Text style={{ color: '#FFF', fontSize: 20, }}>{dia.hora_completa}</Text>
                                <Switch
                                    trackColor={{
                                        false: '#CDCDCD',
                                        true: '#FFF',
                                    }}
                                    

                                    thumbColor={dia.ativar == 'true' ? '#87CEFA' : '#FFF'}
                                    value={dia.ativar == 'true' ? true : false}
                                    onChange={() => {
                                        const diaAtualizado = diaSemana[index];

                                        if (diaAtualizado.ativar == 'true') {
                                            diaAtualizado.ativar = 'false';
                                            var identNotificacao = dia.ident_alarme;
                                            console.log('A identificação da NOTIFICAÇÃO é: ' + identNotificacao);
                                            Notifications.cancelScheduledNotificationAsync(identNotificacao);
                                            ativaDesativaAlarme(dia.id, 'false');
                                        } else {
                                            diaAtualizado.ativar = 'true';
                                            agendaAlarmesSemanais(dia.dia, dia.hora, dia.minuto, dia.ident_alarme);
                                            ativaDesativaAlarme(dia.id, 'true');
                                        }

                                        const novoDia = [...diaSemana];
                                        diaSemana[index] = diaAtualizado;
                                        setDiaSemana(novoDia);
                                    }} />
                            </View>
                        ))
                        :
                        <View></View>
                }
            </View>

        </View>


    );


    function pegaDiaSemana(numeroDia) {

        if (numeroDia == 1) {
            return "DOMINGO"
        } else if (numeroDia == 2) {
            return "SEGUNDA FEIRA"
        } else if (numeroDia == 3) {
            return "TERÇA FEIRA"
        } else if (numeroDia == 4) {
            return "QUARTA FEIRA"
        } else if (numeroDia == 5) {
            return "QUINTA FEIRA"
        } else if (numeroDia == 6) {
            return "SEXTA FEIRA"
        } else if (numeroDia == 7) {
            return "SÁBADO"
        }

    }






}


