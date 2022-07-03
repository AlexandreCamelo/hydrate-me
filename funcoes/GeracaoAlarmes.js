import * as React from 'react';
import VarGlobais from '../Global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { limparTabela } from '../componentes/BD/BDGeral';
import { incluirDiaEHora } from '../componentes/BD/tabDiasAtivos';
import * as Notifications from 'expo-notifications';
import { eachMinuteOfInterval } from 'date-fns';
import {  incluirDadosUsuario } from '../componentes/BD/tabDadosUsuario'


async function gerarPlanoHidratacao(todosOsDias, dom, seg, ter, qua, qui, sex, sab) {

    

        if (!await tudoPreenchido()) {
            return 'false';
        }

        if (!await dormirDepoisDeAcordar()) {
            return 'false';
        }


        await limparTabela('tbldiasativos'); //Limpa a tabela de alarmes, do banco de dados

        //Se todosOsDias = true, os dias têm que ficar marcados como 'desl'
        if (todosOsDias) {
            if (dom == 'liga' || seg == 'liga' || ter == 'liga' || qua == 'liga' || qui == 'liga' || sex == 'liga' || sab == 'liga') {
                console.log("###### FUNÇÃO gerarPlanoHidratacao ---- Se escolher a variável 'todosOsDias=true', nenhum dos dias pode ser marcado como 'liga'. ####");
                return 'false';
            }
        }

        await definePeriodoDiario();
        await defineMetaMililitros();
        await definePorcaoAgua();
        await defineQtdeDiariaAlarmes();
        await defineIntervaloACadaAlarme();

        var horasDosAlarmes = await defineHorasDosAlarmes();




        await incluirDadosUsuario(
            VarGlobais.glSexo,
            VarGlobais.glFaixaEtaria,
            VarGlobais.glPeso,
            VarGlobais.glHoraAcordar,
            VarGlobais.glHoraDormir,
            VarGlobais.glPeriodoDiario,
            VarGlobais.glMetaMililitros,
            VarGlobais.glPorcaoAgua,
            VarGlobais.glQtdeDiariaAlarmes,
            VarGlobais.glIntervaloACadaAlarme,
            'true'
        )



        if (todosOsDias) {
            for (var dia = 1; dia <= 7; dia++) {
                var nomeDoDia = await nomeDiaDaSemana(dia, true);
                console.log('###########################################');
                console.log('DIA DA SEMANA: ' + nomeDoDia.toUpperCase());
                console.log('###########################################');

                for (var h = 0; h < horasDosAlarmes.length; h++) {
                    var hora = horasDosAlarmes[h].getHours();
                    var min = horasDosAlarmes[h].getMinutes();
                    var horaComp = pegaHora(horasDosAlarmes[h], true)
                    var ident = nomeDoDia + seMenorQueDez(hora) + seMenorQueDez(min);

                    await agendaAlarmesSemanais(dia, hora, min, ident);
                    await incluirDiaEHora(ident, dia, hora, min, 0, 'true');

                    console.log('HORA do alarme: ' + horaComp + ' - IDENTIFICADOR --> ' + ident);
                }
            }
        }

        //Alarme inicial, 1 minuto após o usuário configurar suas informações
        var dia2 = new Date(Date.now()).getDay() + 1;
        var hora2 = new Date(Date.now()).getHours();
        var minuto2 = new Date(Date.now()).getMinutes() + 1;

        await agendaAlarmesSemanais(dia2, hora2, minuto2, 'inicial');
        return 'true';
    
}



async function agendaAlarmesSemanais(diaSemana, hora, minuto, identificador) {
    var titulo = 'BEBA ÁGUA';
    var corpo = "Está na hora de se hidratar!";

    await Notifications.scheduleNotificationAsync({
        identifier: identificador,

        content: {
            title: titulo,
            body: corpo,

        },
        trigger: {
            weekday: diaSemana,
            hour: hora,
            minute: minuto,
            repeats: true,


        }
    });
}










// async function pegaTodosAgendamentos() {
//     var notificacoes = [];
//     notificacoes = await Notifications.getAllScheduledNotificationsAsync();

//     for (var i = 0; i < notificacoes.length; i++) {
//         console.log('###### AGENDAMENTO RECUPERADO: ' + notificacoes[i].identifier);
//     }
// }




async function removeChaves() {

    
        var chaves = [];
        chaves = await AsyncStorage.getAllKeys();

        if (chaves.length == 0) {
            console.log('NÃO EXISTEM CHAVES A REMOVER!!!');
            return;
        }

        for (var i = 0; i < chaves.length; i++) {
            console.log('###### CHAVE REMOVIDA: ##### ' + chaves[i]);
        }

        await AsyncStorage.multiRemove(chaves);
        console.log('*** VERIFICANDO SE SOBROU ALGUMA CHAVE...: ***');
        pegaChaves();

    

}



async function definePeriodoDiario() {
    
        var dormir = VarGlobais.glHoraDormir;
        var acordar = VarGlobais.glHoraAcordar;
        // var dormir = await AsyncStorage.getItem('horaDormir');
        // var acordar = await AsyncStorage.getItem('horaAcordar');

        VarGlobais.glPeriodoDiario = parseInt(dormir) - parseInt(acordar) - 1;  //Subtrai -1 para que o último alarme seja 1 hora antes da hora de dormir
        console.log('Período diário é: ' + VarGlobais.glPeriodoDiario);
        return parseInt(dormir) - parseInt(acordar) - 1;
    
}



async function defineMetaMililitros() {
    
        if (VarGlobais.glFaixaEtaria == "ate17") {
            VarGlobais.glMetaMililitros = VarGlobais.glPeso * VarGlobais.glMlPorKgAte17;
        } else if (VarGlobais.glFaixaEtaria == "18a55") {
            VarGlobais.glMetaMililitros = VarGlobais.glPeso * VarGlobais.glMlPorKg18a55;
        } else if (VarGlobais.glFaixaEtaria == "56a65") {
            VarGlobais.glMetaMililitros = VarGlobais.glPeso * VarGlobais.glMlPorKg56a65;
        } else if (VarGlobais.glFaixaEtaria == "66ouMais") {
            VarGlobais.glMetaMililitros = VarGlobais.glPeso * VarGlobais.glMlPorKg66ouMais;
        }
        return true;

    
}


async function definePorcaoAgua() {
    
        var porcao = Math.ceil(VarGlobais.glMetaMililitros / VarGlobais.glPeriodoDiario);

        if (porcao < 100) {
            VarGlobais.glPorcaoAgua = 100;
        } else if (porcao > 100 && porcao < 150) {
            VarGlobais.glPorcaoAgua = 150;
        } else if (porcao > 150 && porcao < 200) {
            VarGlobais.glPorcaoAgua = 200;
        } else if (porcao > 200 && porcao < 250) {
            VarGlobais.glPorcaoAgua = 250;
        } else if (porcao > 250 && porcao < 300) {
            VarGlobais.glPorcaoAgua = 300;
        } else if (porcao > 300 && porcao < 350) {
            VarGlobais.glPorcaoAgua = 350;
        } else if (porcao > 350 && porcao < 400) {
            VarGlobais.glPorcaoAgua = 400;
        } else if (porcao > 400 && porcao < 450) {
            VarGlobais.glPorcaoAgua = 450;
        } else if (porcao > 450 && porcao < 500) {
            VarGlobais.glPorcaoAgua = 500;
        } else if (porcao > 500 && porcao < 550) {
            VarGlobais.glPorcaoAgua = 550;
        } else if (porcao > 550 && porcao < 600) {
            VarGlobais.glPorcaoAgua = 600;
        } else if (porcao > 600 && porcao < 650) {
            VarGlobais.glPorcaoAgua = 650;
        } else if (porcao > 650 && porcao < 700) {
            VarGlobais.glPorcaoAgua = 700;
        } else if (porcao > 700 && porcao < 750) {
            VarGlobais.glPorcaoAgua = 750;
        } else if (porcao > 750 && porcao < 800) {
            VarGlobais.glPorcaoAgua = 800;
        } else if (porcao > 800 && porcao < 850) {
            VarGlobais.glPorcaoAgua = 850;
        } else if (porcao > 850 && porcao < 900) {
            VarGlobais.glPorcaoAgua = 900;
        } else if (porcao > 900 && porcao < 950) {
            VarGlobais.glPorcaoAgua = 950;
        } else if (porcao > 950 && porcao < 1000) {
            VarGlobais.glPorcaoAgua = 1000;
        } else {
            VarGlobais.glPorcaoAgua = porcao;
        }

        console.log('<<<<<<<<<< A PORÇÃO DE ÁGUA É: ' + VarGlobais.glPorcaoAgua);

    

}

async function defineQtdeDiariaAlarmes() {
    
        VarGlobais.glQtdeDiariaAlarmes = Math.ceil(VarGlobais.glMetaMililitros / VarGlobais.glPorcaoAgua);

   



}

async function defineIntervaloACadaAlarme() {

    
        var intervaloACadaAlarme = Math.ceil(VarGlobais.glMetaMililitros / VarGlobais.glPorcaoAgua);
        intervaloACadaAlarme = VarGlobais.glPeriodoDiario / VarGlobais.glQtdeDiariaAlarmes * 60;
        intervaloACadaAlarme = Math.ceil(intervaloACadaAlarme);

        if (VarGlobais.glPeriodoDiario >= 6) {
            if (intervaloACadaAlarme < 60) {
                intervaloACadaAlarme = 60;
            } else if (intervaloACadaAlarme > 60 && intervaloACadaAlarme <= 100) {
                intervaloACadaAlarme = 90;
            } else if (intervaloACadaAlarme >= 91 && intervaloACadaAlarme <= 130) {
                intervaloACadaAlarme = 120;
            } else if (intervaloACadaAlarme >= 131 && intervaloACadaAlarme <= 200) {
                intervaloACadaAlarme = 180;
            }
        } else {
            if (intervaloACadaAlarme != 30) {
                intervaloACadaAlarme = 30;
            }
        }

        VarGlobais.glIntervaloACadaAlarme = parseInt(intervaloACadaAlarme);
        console.log('A definição de intervalo a cada alarme é: ' + VarGlobais.glIntervaloACadaAlarme)
        return parseInt(intervaloACadaAlarme);
    
}



async function defineHorasDosAlarmes() {
   
        var horaAcordar = VarGlobais.glHoraAcordar;
        var horaDormir = VarGlobais.glHoraDormir;
        var intervaloACadaAlarme = await defineIntervaloACadaAlarme();

        var data1 = new Date(Date.now());
        data1.setHours(horaAcordar, 0, 0);
        var data2 = new Date(Date.now());
        data2.setHours(horaDormir - 1, 0, 0);  //FAZENDO OS ALARMES PARAREM, 1 HORA ANTES DA HORA DE DORMIR

        //USANDO A BIBLIOTECA date-fns
        var datasNoIntervalo = eachMinuteOfInterval(
            {
                start: data1,
                end: data2,
            }, {
            step: intervaloACadaAlarme,
        }

        );

        return datasNoIntervalo;
   
}




async function tudoPreenchido() {
    
    if (VarGlobais.glFaixaEtaria == '' || VarGlobais.glFaixaEtaria == null) {
        return false;
    } else if (VarGlobais.glPeso == '0' || VarGlobais.glPeso == null) {
        return false;
    } else if (VarGlobais.glHoraAcordar == null) {
        return false;
    } else if (VarGlobais.glHoraDormir == null) {
        return false;
    } else {
        return true;
    }
}


async function dormirDepoisDeAcordar() {
    var acordar = VarGlobais.glHoraAcordarFormatoHora;
    var dormir = VarGlobais.glHoraDormirFormatoHora;
    var intervalo = dormir - acordar;

    if (intervalo < 0) {
        alert('A hora de dormir deve ser maior que a hora de acordar')
        return false;
    } else {
        return true;
    }

}



async function nomeDiaDaSemana(numeroDoDia1a7, abreviado) {
    if (numeroDoDia1a7 == 1) {
        if (abreviado) {
            return 'dom';
        } else {
            return 'domingo';
        }
    } else if (numeroDoDia1a7 == 2) {
        if (abreviado) {
            return 'seg';
        } else {
            return 'segunda';
        }
    } else if (numeroDoDia1a7 == 3) {
        if (abreviado) {
            return 'ter';
        } else {
            return 'terca';
        }
    } else if (numeroDoDia1a7 == 4) {
        if (abreviado) {
            return 'qua';
        } else {
            return 'quarta';
        }
    } else if (numeroDoDia1a7 == 5) {
        if (abreviado) {
            return 'qui';
        } else {
            return 'quinta';
        }
    } else if (numeroDoDia1a7 == 6) {
        if (abreviado) {
            return 'sex';
        } else {
            return 'sexta';
        }
    } else if (numeroDoDia1a7 == 7) {
        if (abreviado) {
            return 'sab';
        } else {
            return 'sabado';
        }
    } else {
        return '';
    }

}



async function pegaChaves() {
    let chaves = [];
   
        chaves = await AsyncStorage.getAllKeys();
        for (var i = 0; i < chaves.length; i++) {
            console.log(chaves[i]);
        }

        return true;
    
}



function pegaHora(dataCompleta, comPontuacao) {
    var hor = dataCompleta.getHours();
    var min = dataCompleta.getMinutes();

    if (hor == 0 && min == 0) {
        hora = 23;
        minuto = 59;
    }

    return horaMinutoFormatados(hor, min, comPontuacao);
}



function horaMinutoFormatados(horas, minutos, comPontuacao) {
    var hor = '';
    var min = '';


    if (horas < 10) {
        hor = '0' + "'" + horas + "'";
    }
    if (minutos < 10) {
        min = '0' + "" + minutos + "'";
    }

    if (comPontuacao) {
        return hor + ':' + min;
    } else {
        return hor + min;
    }

}


function seMenorQueDez(numero = 0) {
    var num = numero;

    if (num < 10) {
        num = num.toString();
        num = '0' + num;
    }

    return num.toString();
}


function pegaDataBR(dataCompleta) {
    var dia = dataCompleta.getDate();
    var mes = dataCompleta.getMonth() + 1;
    var ano = dataCompleta.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }

    return dia + '/' + mes + '/' + ano;

}

function pegaDataUS(dataCompleta) {
    var dia = dataCompleta.getDate();
    var mes = dataCompleta.getMonth() + 1;
    var ano = dataCompleta.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }

    return ano + '-' + mes + '-' + dia;

}



export {
    gerarPlanoHidratacao,
    //pegaTodosAgendamentos,
    pegaHora,
    definePeriodoDiario,
    defineIntervaloACadaAlarme,
    defineMetaMililitros,
    defineHorasDosAlarmes,
    defineQtdeDiariaAlarmes,
    definePorcaoAgua,
    removeChaves,
    agendaAlarmesSemanais,
}
