
import varGlobais from '../../Global';
import { parseISO, format, formatRelative, formatDistance, isAfter, eachMinuteOfInterval } from 'date-fns';




function incluirMlBebidos(dataNumerica, dataUS, hora, diaSemana, ml) {
  return new Promise((resolve) => {
    const bd = varGlobais.glBD;
    bd.transaction(
      (tx) => {
        tx.executeSql("insert into tblbebido (data_numerica, data, hora, dia_Semana, ml_bebidos) values (?, ?, ?, ?, ?)",
          [dataNumerica, dataUS, hora, diaSemana, ml],
          () => console.log('>>>>>> Inclusos ' + ml + ' MLs, na data: ' + dataUS + ' -- ' + hora));
        tx.executeSql("select * from tblbebido;", [], (_, { rows }) =>
          resolve(() => console.log('MLs JÁ BEBIDOS: ' + JSON.stringify(rows))));
      });
  }) //fim da promise
}





function agrupaBebidosPorData(){

    console.log('>>>>>>> PEGANDO MLs BEBIDOS DOS ÚLTIMOS 7 DIAS');
    return new Promise((resolve) => {
      const bd = varGlobais.glBD;
      bd.transaction((tx) => {
        tx.executeSql(
          // "select *, sum(ml_bebidos) as ML, from tblbebido GROUP data ORDER BY id DESC LIMIT 7", [],
          "SELECT id, data_numerica, data, hora, dia_semana, SUM(ml_bebidos) AS ml_bebidos FROM tblbebido GROUP BY data ORDER BY id DESC LIMIT 7", [],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              console.log('ARRAY DE DADOS DO USUÁRIO TEM ' + _array.length + 'itens. Então é TRUE.');
              var arrayCheioDeArrays = [];
              listarMLsBebidos(_array).then(resolve(_array))
              
            } else {
              console.log('ARRAY DE DADOS DO USUÁRIO TEM ' + _array.length + 'itens. Então é FALSE.');
              resolve(false);
            }
          }
        );
      });
  
  
    }); //fim da promise
}








function limpaTabelaBebidos() {
  const bd = varGlobais.glBD;
  bd.transaction(
    (tx) => {
      tx.executeSql("delete from tblbebido", [],
        () => console.log('>>>>>> A tabela de bebidos foi limpa'));
    });
}

// function excluirUltimoRegistro() {
//   const bd = varGlobais.glBD;
//   bd.transaction(
//     (tx) => {
//       tx.executeSql("delete from tblbebido where id in (select * from tblbebido ORDER BY id DESC LIMIT 1)", [],
//         () => console.log('>>>>>> A tabela de bebidos foi limpa'));
//     });
// }



var idUltimoRegistro = null;

function pegarUltimoRegistro() {

  return new Promise((resolve) => {
    var hoje = format(new Date(Date.now()), 'yyyy-MM-dd')
    const bd = varGlobais.glBD;
    console.log('Entrei em selecionar o último registro.');
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tblbebido WHERE data = '" + hoje + "' ORDER BY id DESC LIMIT 1", [],
        (_, { rows: { _array } }) => {
          if (_array.length == 0) {
            console.log('Não existem registros para apagar.')
            resolve(null);
          }

          try {
            console.log('O código do último registro é: ' + idUltimoRegistro);
            resolve(idUltimoRegistro = _array[0].id);
          } catch (e) {
            console.log('Houve um erro ao tentar selecionar o último registro para exclusão: ' + e)
            resolve(null);
          }
        }
      ) //fim do SQL de SELECT
    });
  }); //fim da promise

}

async function excluirUltimoRegistro() {

  //return new Promise((resolve) => {
  var hoje = format(new Date(Date.now()), 'yyyy-MM-dd')
  const bd = varGlobais.glBD;
  console.log('Entrei em excluir o último registro.');
  var codigo = await pegarUltimoRegistro();
  
  bd.transaction((tx) => {

    //var codigo = await pegarUltimoRegistro()  //.then(
    // () => {
    console.log('Aqui em DELETE, o código do último registro é: ' + codigo);
    var stringSQL = "DELETE FROM tblbebido WHERE id = " + codigo;
    console.log('A string SQL é: ' + stringSQL);

    tx.executeSql(
      stringSQL, [],
      (_, { rows: { _array } }) => {
        console.log('O último registro, de código ' + codigo + ' foi excluído');
      }
    ); //fim do sql de DELETE
    //} //fim da função dentro do THEN
    //) //FIM DO THEN


  });
  //}); //fim da promise

}


function pegarMlsBebidos(listarBebidos) {

  return new Promise((resolve) => {
    var hoje = format(new Date(Date.now()), 'yyyy-MM-dd')
    const bd = varGlobais.glBD;
    console.log('Entrei em pegar os Mls bebidos.');
    bd.transaction((tx) => {
      tx.executeSql(
        "select * from tblbebido WHERE data = '" + hoje + "'", [],
        (_, { rows: { _array } }) => {

          if (_array.length == 0) {
            resolve(0);
          }

          try {
            var bebidosHoje = 0;
            var tudo = [];
            tudo = JSON.stringify(_array);
            tudo = JSON.parse(JSON.stringify(_array));

            for (var linha = 0; linha < tudo.length; linha++) {
              var mlNaLinha = parseInt(tudo[linha].ml_bebidos);
              bebidosHoje = bebidosHoje + mlNaLinha;
            }
            console.log('Consegui somar os ml bebidos, na tabela: ' + bebidosHoje)
            if (listarBebidos) {
              listarMLsBebidos(_array);
            }
            resolve(bebidosHoje.toFixed());

          } catch (e) {
            console.log('Não existem MLs bebidos. Por isso, vou retornar ZERO: ' + e)
            resolve(0);
          }
        }
      );
    });
  }); //fim da promise

}



function listarMLsBebidos(conteudo) {
  if (conteudo.length == 0 || conteudo == null) {
    console.log("A TABELA DE BEBIDOS NÃO POSSUI DADOS");
    return;
  }

  return new Promise((resolve) => {
    var tudo = [];
    tudo = JSON.stringify(conteudo);
    tudo = JSON.parse(JSON.stringify(conteudo));
    console.log('ID=====DATA=====HORA==========DIA SEMANA==========ML BEBIDOS');

    for (var linha = 0; linha < tudo.length; linha++) {
      var cod = tudo[linha].id;
      var dt = tudo[linha].data;
      var hr = tudo[linha].hora;
      var dia = tudo[linha].dia_semana;
      var beb = tudo[linha].ml_bebidos;
      console.log(cod + '     ' + dt + '      ' + hr + '             ' + dia + '             ' + beb);
    }

    resolve(console.log('ML BEBIDOS, listados'))
  }); //FIM DA PROMISE

}












export {
  incluirMlBebidos,
  pegarMlsBebidos,
  listarMLsBebidos,
  limpaTabelaBebidos,
  excluirUltimoRegistro,
  agrupaBebidosPorData,
}