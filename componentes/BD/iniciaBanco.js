import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";


//Função para abrir o banco de dados (se não existir, cria, automaticamente)
//#####NUNCA TRANSFORMAR ESSA FUNÇÃO EM ASSÍNCRONA, OU RETORNAR UMA PROMISE, POIS NÃO FUNCIONA!!! 
//PERDI UMA TARDE INTEIRA PARA DESCOBRIR ISSO!!!!
function AbreBanco() {
    console.log('>>>>>>>> Abrindo banco de dados...');
    if (Platform.OS === "web") {
      console.log('>>>>>>>> A plataforma é WEB...');

      return {
        transaction: () => {
          return {
            executeSql: () => { },
          };
        },
      };
    }
    const db = SQLite.openDatabase("alarmes.db");
    console.log('Banco aberto');
    return db;
}


export {
  AbreBanco,
}
















