import VarGlobais from '../../Global';



function criaTabelas() {
  return new Promise((resolve) => {
    console.log('>>>>>>>> Criando tabelas do sistema.');
    const bd = VarGlobais.glBD;
    

    
    bd.transaction((tx) => {

      tx.executeSql("create table if not exists tbldadosusuario (id integer primary key not null, "
        + "sexo text, idade text, peso integer, hora_acordar text, hora_dormir text, "
        + "periodo_diario integer, meta_ml integer, porcao_agua integer, qtde_diaria_alarmes integer, "
        + "intervalo_a_cada_alarme integer, dados_iniciais_preenchidos text);", [], ()=>{console.log('Criei a tabela de dados do usuário')}); //, () => console.log('Não consegui criar a tabela de dados do usuário'));



      // tx.executeSql("insert into tbldadosusuario (sexo, idade, peso, "
      //   + "hora_acordar, hora_dormir, periodo_diario, meta_ml, "
      //   + "porcao_agua, qtde_diaria_alarmes, intervalo_a_cada_alarme, dados_iniciais_preenchidos) "
      //   + "VALUES ('M', 'ate17', 88, '04:00', '23:00', 14, 2500, 200, 10, 60, 'true');", [], () => { console.log('Adicionei dados do usuário') });

       tx.executeSql("create table if not exists tblbebido (id integer primary key not null, data_numerica integer, data text, hora text, dia_semana integer, ml_bebidos integer);", [], () => { console.log('Criei a tabela de MLs Bebidos') }); //console.log('Criei a tabela de MLs Bebidos')

       tx.executeSql(
         "create table if not exists tbldiasativos (id integer primary key not null, ident_alarme text, dia integer, hora integer, minuto integer, segundo integer, hora_completa text, ativar text);", [], ()=> resolve(console.log('Resolvi a criação de todas as tabelas')));
       });
  }) //fim da promise
}






async function excluiTabela(tabelaAExcluir) {
  const bd = VarGlobais.glBD;
  bd.transaction((tx) => {
    tx.executeSql("drop table if exists " + tabelaAExcluir + ";"
    );
  });
  console.log('>>>>>>>> Tabela excluída: ' + tabelaAExcluir);
  return true;

}



async function limparTabela(tabela) {
  const bd = VarGlobais.glBD;
  bd.transaction(
    (tx) => {
      tx.executeSql("delete from tbldiasativos;", []);
    });
  console.log('Todos os dados da tabela ´' + tabela + '´ foram excluídos.');
  return true;  //%%%%%% É NECESSÁRIO QUE A FUNÇÃO TENHA UM RETORNO **NO SEU FINAL** PARA GARANTIR QUE, QUANDO ELA FOR CHAMADA, TENHA UM COMPORTAMENTO SÍNCRONO.
  //DO CONTRÁRIO, SUA CHAMADA DEIXARÁ PASSAR PARA A PRÓXIMA LINHA DE CÓDIGO, ASSIM QUE ELA FOR CHAMADA (NÃO ESPERANDO QUE ELA TERMINE) %%%%%%%%% 

} //fim da função



export {
  criaTabelas,
  excluiTabela,
  limparTabela,
}
















