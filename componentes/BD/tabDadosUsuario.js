import AsyncStorage from '@react-native-async-storage/async-storage';
import varGlobais from '../../Global';

var existemDadosDeUsuario = null;




function incluirDadosUsuario(sexo, idade, peso, horaAcordar, horaDormir, periodoDiario, metaML, porcaoAgua, qtdeDiariaAlarmes, intervACadaAlarme, dadosIniciaisPreenchidos) {
  console.log('>>>>>>>> Inclusão de dados do usuário');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;

    jaExistemDadosDeUsuario().then(
      () => console.log('Valor de ´existemDados´ é: ' + existemDadosDeUsuario)
    ).then(() => {

      if (existemDadosDeUsuario == true) {
        alterarDadosUsuario(sexo, idade, peso, horaAcordar, horaDormir, periodoDiario, metaML, porcaoAgua, qtdeDiariaAlarmes, intervACadaAlarme, dadosIniciaisPreenchidos);
        resolve(console.log("Dados do usuário, alterados."));

      } else {
        bd.transaction((tx) => {
          tx.executeSql("insert into tbldadosusuario (sexo, idade, peso, hora_acordar, "
            + "hora_dormir, periodo_diario, meta_ml, porcao_agua, qtde_diaria_alarmes, "
            + "intervalo_a_cada_alarme, dados_iniciais_preenchidos) "
            + "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [sexo, idade, peso, horaAcordar, horaDormir, periodoDiario, metaML, porcaoAgua, qtdeDiariaAlarmes, intervACadaAlarme, dadosIniciaisPreenchidos],
            () => {
              resolve(console.log('Dados do usuário, inseridos'));
            });
        });
      }
    }) //Fim do segundo 'then'

  }) //fim da promise
}

function jaExistemDadosDeUsuario() {
  console.log('>>>>>>> VERIFICANDO SE JÁ EXISTEM DADOS DO USUÁRIO');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            console.log('ARRAY DE DADOS DO USUÁRIO TEM ' + _array.length + 'itens. Então é TRUE.');
            existemDadosDeUsuario = true
            resolve(true);
          } else {
            console.log('ARRAY DE DADOS DO USUÁRIO TEM ' + _array.length + 'itens. Então é FALSE.');
            existemDadosDeUsuario = false
            resolve(false);
          }
        }
      );
    });


  }); //fim da promise
}






function alterarDadosUsuario(sexo, idade, peso, horaAcordar, horaDormir, periodoDiario, metaML, porcaoAgua, qtdeDiariaAlarmes, intervACadaAlarme, mlCopo, dadosIniciaisPreenchidos) {
  console.log('<><><><><><> Entrei em ALTERAR DADOS USUÁRIO');
  const bd = varGlobais.glBD;

  bd.transaction((tx) => {
    tx.executeSql("update tbldadosusuario set sexo = ?, idade = ?, peso = ?, hora_acordar = ?, "
      + "hora_dormir = ?, periodo_diario = ?, meta_ml = ?, porcao_agua = ?, qtde_diaria_alarmes = ?, "
      + "intervalo_a_cada_alarme = ?, copo = ?, dados_iniciais_preenchidos = ?",
      [sexo, idade, peso, horaAcordar, horaDormir, periodoDiario, metaML, porcaoAgua, qtdeDiariaAlarmes, intervACadaAlarme, mlCopo, dadosIniciaisPreenchidos],
      () => console.log('Consegui atualizar os dados do usuário'), () => console.log('NÃO Consegui atualizar os dados do usuário'))
  });

  return true;
}




function imprimirDadosDoUsuario() {
  console.log('>>>>>>> IMPRESSÃO DE DADOS DO USUÁRIO');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => { resolve(leTodasAsLinhasDadosUsuario(_array)) }
      );
    });


  }); //fim da promise
}





function pegarDadosDoUsuario() {
  console.log('>>>>>>> Verificando se existem DADOS DO USUÁRIO...');
  const bd = varGlobais.glBD;
  return new Promise((resolve) => {
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => resolve(_array)
      );
    });


  }); //fim da promise
}




function pegarSexoUsuario() {
  const bd = varGlobais.glBD;
  return new Promise((resolve) => {
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => { resolve(_array[0].sexo) }
      );
    });
  }); //fim da promise
}


function pegarMlCopo() {
  const bd = varGlobais.glBD;
  return new Promise((resolve) => {
    
    bd.transaction((tx) => {
      try{
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => { resolve(_array[0].porcao_agua) }
      );

    }catch(e){
      console.log('Se não tem dados do uuário, entrei no CATCH e retornei ZERO');
      resolve(0);
    }



    });
  


  }); //fim da promise
}

function pegarMetaDiaria() {
  const bd = varGlobais.glBD;
  return new Promise((resolve) => {
    console.log('Entrei em pegar a meta diária');
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => {

          try {
            resolve(_array[0].meta_ml);
          } catch (e) {
            console.log('Não existem dados do usuário e, portanto, não tem META DIÁRIA.')
            resolve(0);
          }




        }
      );
    });


  }); //fim da promise
}



function mudarSexoUsuario(sexo) {
  console.log('<><><><><><> ALTERANDO SEXO USUÁRIO');
  const bd = varGlobais.glBD;

  bd.transaction((tx) => {
    tx.executeSql("update tbldadosusuario set sexo = ?",
      [sexo],
      () => console.log('Consegui MUDAR o sexo do usuário para: ' + sexo), () => console.log('NÃO Consegui mudar o sexo do usuário para ' + sexo))
  });

  return true;
}

function mudarIdade(idade) {
  console.log('<><><><><><> ALTERAR IDADE USUÁRIO');
  const bd = varGlobais.glBD;

  bd.transaction((tx) => {
    tx.executeSql("update tbldadosusuario set idade = ?",
      [idade],
      () => console.log('Consegui MUDAR a idade do usuário para: ' + idade), () => console.log('NÃO Consegui mudar a idade do usuário para ' + idade))
  });

  return true;
}


function mudarPorcaoAgua(porcao) {
  console.log('<><><><><><> ALTERAR IDADE USUÁRIO');
  const bd = varGlobais.glBD;

  bd.transaction((tx) => {
    tx.executeSql("update tbldadosusuario set porcao_agua = ?",
      [porcao],
      () => console.log('Consegui MUDAR a porção de água para: ' + porcao), () => console.log('NÃO Consegui mudar a porção de água para ' + porcao))
  });

  return true;
}



async function marcarDadosIniciaisPreenchidos(preenchidos) {
  console.log('<><><><><><> ALTERAR SE OS DADOS INICIAIS DO USUÁRIO FORAM PREENCHIDOS');
  const bd = varGlobais.glBD;
  AsyncStorage.setItem('dadosIniciaisPreenchidos', preenchidos);

  bd.transaction((tx) => {
    tx.executeSql("update tbldadosusuario set dados_iniciais_preenchidos = ?",
      [preenchidos],
      () => console.log('Consegui o status dos dados iniciais para: ' + preenchidos), () => console.log('Não Consegui o status dos dados iniciais para' + preenchidos))
  });

  return true;
}



function verificarDadosIniciaisPreenchidos() {
  return new Promise((resolve) => {
    console.log('Verificando dados iniciais preenchidos...');
    const bd = varGlobais.glBD;
    bd.transaction((tx) => {

      tx.executeSql(
        "select * from tbldadosusuario ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => {
          try {
            resolve(_array[0].dados_iniciais_preenchidos);
          } catch (e) {
            console.log('Se houve um erro na verificação dos dados preenchidos, vou retornar FALSE');
            resolve('false');
          }
        }
      );

    });
  }); //fim da promise
}




function leTodasAsLinhasDadosUsuario(conteudo) {
  if (conteudo.length == 0 || conteudo == null) {
    console.log("A TABELA DE DADOS DO USUÁRIO NÃO POSSUI DADOS");
    return;
  }

  return new Promise((resolve) => {
    var tudo = [];
    tudo = JSON.stringify(conteudo);
    tudo = JSON.parse(JSON.stringify(conteudo));
    console.log('ID=====SEXO==========IDADE==========PESO==========HORA ACORDAR==========HORA DORMIR==========INICIO PREENCHIDO========META MLs==========PORÇÃO ÁGUA');

    for (var linha = 0; linha < tudo.length; linha++) {
      var cod = tudo[linha].id;
      var sex = tudo[linha].sexo;
      var idade = tudo[linha].idade;
      var peso = tudo[linha].peso;
      var hAcordar = tudo[linha].hora_acordar;
      var hDormir = tudo[linha].hora_dormir;
      var metaMl = tudo[linha].meta_ml
      var inicioPreench = tudo[linha].dados_iniciais_preenchidos;
      var mlCopo = tudo[linha].porcao_agua;
      console.log(cod + '      ' + sex + '             ' + idade + '             ' + peso + '            ' + hAcordar + '                  ' + hDormir + '               ' + inicioPreench + '               ' + metaMl + '               ' + mlCopo);
    }

    resolve(console.log('Dados listados'))
  }); //FIM DA PROMISE

}



function limparInformacoesUsuario() {
  console.log('<><><><><><> LIMPANDO AS INFORMAÇÕES DO USUÁRIO');
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;

    bd.transaction((tx) => {
      tx.executeSql("DELETE FROM tbldadosusuario", [],
        resolve(console.log('Todos os dados do usuário foram excluídos')), resolve(console.log('NÃO Consegui excluir os dados do usuário')))
    });

  }); //Fim da promise

}




export {
  incluirDadosUsuario,
  alterarDadosUsuario,
  pegarDadosDoUsuario,
  imprimirDadosDoUsuario,
  pegarSexoUsuario,
  mudarSexoUsuario,
  marcarDadosIniciaisPreenchidos,
  verificarDadosIniciaisPreenchidos,
  mudarIdade,
  pegarMetaDiaria,
  pegarMlCopo,
  limparInformacoesUsuario,
  mudarPorcaoAgua,

}





