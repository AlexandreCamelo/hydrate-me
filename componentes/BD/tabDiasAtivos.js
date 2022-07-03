import varGlobais from '../../Global';



function incluirDiaEHora(identAlarme, dia, hora, minuto, segundo, ativar) {
  return new Promise((resolve, reject) => {
    var horaCompleta = horaMinutoFormatados(hora, minuto, true);


    console.log('>>>>>>>> Entrei na inclusão de dias e horas');
    const bd = varGlobais.glBD;
    bd.transaction((tx) => {

      tx.executeSql("insert into tbldiasativos (ident_alarme, dia, hora, minuto, "
        + "segundo, hora_completa, ativar) values (?, ?, ?, ?, ?, ?, ?)",
        [identAlarme, dia, hora, minuto, segundo, horaCompleta, ativar],
        () => resolve(console.log('Dia ' + dia + ' e hora ' + horaCompleta + ' - ID: ' + identAlarme + ', INCLUSOS.')),
        () => reject('Não consegui incluir nenhum dia.')
      );

    });

  }) //fim da promise
}


function horaMinutoFormatados(horas, minutos, comPontuacao) {

  if (horas < 10) {
    horas = '0' + horas;
  }
  if (minutos < 10) {
    minutos = '0' + minutos;
  }

  if (comPontuacao) {
    return horas + ':' + minutos;
  } else {
    return horas + minutos;
  }

}



async function ativarTodosDias() {

  await ativaDesativaDia(bd, 0, 'true');
  await ativaDesativaDia(bd, 1, 'true');
  await ativaDesativaDia(bd, 2, 'true');
  await ativaDesativaDia(bd, 3, 'true');
  await ativaDesativaDia(bd, 4, 'true');
  await ativaDesativaDia(bd, 5, 'true');
  await ativaDesativaDia(bd, 6, 'true');
}




async function ativaDesativaAlarme(idDaTabela, ativar) {
  console.log('<><><><><><> Entrei em ATUALIZAR ALARME POR ID');
  const bd = varGlobais.glBD;
  bd.transaction((tx) => {
    tx.executeSql("update tbldiasativos set ativar = ? where id = ?", [ativar, idDaTabela]), () => console.log('Consegui atualizar o dia ' + dia), () => console.log('NÃO CONSEGUI atualizar o dia ' + dia);
  });

  await selecionarPorId(idDaTabela);
  console.log('Atualizei o alarme.');
  return true;

}

async function ativaDesativaDia(dia, ativar) {
  console.log('<><><><><><> Entrei em ATUALIZAR DIA');
  const bd = varGlobais.glBD;
  bd.transaction((tx) => {
    tx.executeSql("update tbldiasativos set ativar = ? where dia = ?", [ativar, dia]), () => console.log('Consegui atualizar o dia ' + dia), () => console.log('NÃO CONSEGUI atualizar o dia ' + dia);
  });

  console.log('Atualizei o dia.');
  return true;

}




function selecionarTodosOsDias() {
  console.log('>>>>>>> SELEÇÃO DE DIAS ATIVOS');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;

    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldiasativos", [],
        (_, { rows: { _array } }) => {

          if (_array.length === 0 || _array === null) {
            console.log('Nada de dias ativos.');
            resolve(null);
          } else {
            resolve(() => console.log('>>>>>>>> Dias ativos, inclusos <<<<<<<<'))
            resolve(leTodasAsLinhasDiasAtivos(_array))
          }
        }
      );
    });
  }); //fim da promise
}


async function selecionarPorDia(dia) {
  console.log('>>>>>>> SELEÇÃO DOS HORÁRIOS DOS ALARMES A PARTIR DO DIA DA SEMANA');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;

    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldiasativos WHERE dia = " + dia, [],
        (_, { rows: { _array } }) => {

          if (_array.length === 0 || _array === null) {
            console.log('Nenhum alarme selecionado.');
            resolve(null);
          } else {
            //resolve(()=>console.log('>>>>>>>> Alarmes POR HORA, selecionados <<<<<<<<'))
            leTodasAsLinhasDiasAtivos(_array).then(
              () => {
                varGlobais.glAlarmes = _array;
                resolve(_array);
              }
            )

          }
        }
      );
    });
  }); //fim da promise
}

async function selecionarPorId(id) {
  console.log('>>>>>>> SELEÇÃO DOS HORÁRIOS DOS ALARMES A PARTIR DO DIA DA SEMANA');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;

    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldiasativos WHERE id = " + id, [],
        (_, { rows: { _array } }) => {

          if (_array.length === 0 || _array === null) {
            console.log('Nenhum alarme selecionado.');
            resolve(null);
          } else {
            //resolve(()=>console.log('>>>>>>>> Alarmes POR HORA, selecionados <<<<<<<<'))
            leTodasAsLinhasDiasAtivos(_array).then(
              () => {
                varGlobais.glAlarmes = _array;
                resolve(_array);
              }
            )

          }
        }
      );
    });
  }); //fim da promise
}



//Função para ler todas as linhas armazenadas em uma tabela
function leTodasAsLinhasDiasAtivos(conteudo) {
  console.log("Entrei em lerTodasAsLinhas dos dias ativos");
  return new Promise((resolve, reject) => {
    if (conteudo.length === 0 || conteudo === null) {
      reject("A TABELA DE DIAS ATIVOS NÃO POSSUI DADOS");
    }

    console.log('TAMANHO DO ARRAY: ' + conteudo.length);
    var tudo = [];
    tudo = JSON.stringify(conteudo);
    tudo = JSON.parse(JSON.stringify(conteudo));
    console.log('TUDO: ' + tudo);
    console.log('TAMANHO DE tudo: ' + tudo.length)
    console.log('ID=====DIA==========HORA==========MINUTO==========SEGUNDO==========HORA COMPLETA==========ATIVAR==========IDENT.ALARME');

    for (var linha = 0; linha < tudo.length; linha++) {
      var cod = tudo[linha].id;
      var dia = tudo[linha].dia;
      var hora = tudo[linha].hora;
      var min = tudo[linha].minuto;
      var seg = tudo[linha].segundo;
      var hComp = tudo[linha].hora_completa;
      var ativar = tudo[linha].ativar;
      var idAlarme = tudo[linha].ident_alarme;
      console.log(cod + '      ' + dia + '            ' + hora + '             ' + min + '              ' + seg + '                 ' + hComp + '                 ' + ativar + '                 ' + idAlarme);
    }

    resolve(console.log('Dados listados'))
  }); //FIM DA PROMISE







}

export {
  incluirDiaEHora,
  ativaDesativaDia,
  ativaDesativaAlarme,
  ativarTodosDias,
  selecionarTodosOsDias,
  selecionarPorDia,

}



