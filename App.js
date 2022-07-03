import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { criaTabelas, excluiTabela } from './componentes/BD/BDGeral';
import { imprimirDadosDoUsuario, verificarDadosIniciaisPreenchidos } from './componentes/BD/tabDadosUsuario';
import { AbreBanco } from './componentes/BD/iniciaBanco';
import varGlobais from './Global';
import { removeChaves } from './funcoes/GeracaoAlarmes';
import { LogBox, Image, View, SafeAreaView, Platform } from 'react-native';
import { TelaInicio } from './componentes/telasIniciais/TelaInicial';
import { telaPeso } from './componentes/telasIniciais/configPeso';
import { telaIdadeHomem } from './componentes/telasIniciais/configIdadeHomem';
import { telaIdadeMulher } from './componentes/telasIniciais/configIdadeMulher';
import { telaGenero } from './componentes/telasIniciais/configGenero';
import { telaAcordar } from './componentes/telasIniciais/configHAcordar';
import { telaDormir } from './componentes/telasIniciais/configHDormir';
import { telaFinalizado } from './componentes/telasIniciais/TelaFinalizado';
import { telaProgresso } from './componentes/telasIniciais/progresso';
import { telaPrincipal } from './componentes/telas/telaPrincipal';
import { telaAlarmes } from './componentes/telas/TelaAlarmes';
import { telaAjustes } from './componentes/telas/TelaAjustes';
import { telaDashBoard } from './componentes/telas/TelaDashboard';
import Controle from './componentes/imagens/iconeControle.png';
import Alarme from './componentes/imagens/relogio.png';
import Nivel from './componentes/imagens/iconeNivel.png';
import Estatistica from './componentes/imagens/estatistica3.png';





//import { parseISO, format, formatRelative, formatDistance, isAfter, eachMinuteOfInterval } from 'date-fns';
// import { ptBR } from 'date-fns/locale';
// import { enUS } from 'date-fns/locale';

//Desativa as caixas amarelas de 'WARNINGS'
LogBox.ignoreAllLogs(true);
const Pilha = createNativeStackNavigator();
const Pilha2 = createMaterialTopTabNavigator();



export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [navNormal, setNavNormal] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();





  async function iniciaTudo() {
    varGlobais.glBD = AbreBanco();

    await criaTabelas();
    await imprimirDadosDoUsuario();
    //await selecionarTodosOsDias()
    var informado = await verificarDadosIniciaisPreenchidos();

    informado == 'true' ? varGlobais.glDadosUsuarioInformados = true : varGlobais.glDadosUsuarioInformados = false;
    console.log('ppppppppppppppppppppppp Valor de INFORMADO: ' + informado);

    if (informado == 'false' || informado == '' || informado == null) {
      Notifications.cancelAllScheduledNotificationsAsync();
      await removeChaves();
      /*
      Sempre que o app for instalado, ele deve EXCLUIR TODAS AS TABELAS, 
      antes de iniciar a coleta de todas as informações, pois, 
      caso uma versão anterior do app já tenha sido rodada no celular, 
      poderão existir tabelas com os mesmos nomes das tabelas atuais, 
      só que com colunas diferentes, O QUE CAUSARÁ UM ERRO DE LÓGICA 
      GRAVE E QUASE INDECIFRÁVEL, quando o sistema tentar 
      fazer operações no BD e não conseguir;
      */
      //Excluindo tabelas, pelo motivo acima
      await excluiTabela('tbldadosusuario');
      await excluiTabela('tblbebido');
      await excluiTabela('tbldiasativos');
      await criaTabelas();
      return false;
    }
    else {
      return true;
    }

    // return true;

  }


  async function informaPrimeiraTela() {
    var informado = await verificarDadosIniciaisPreenchidos();

    if (informado == 'true') {
      setNavNormal(true);
      console.log('A primeira tela é *telaPrinc2*');
      return true;
    } else {
      setNavNormal(false);
      console.log('A primeira tela é *tela1*');
      return true;
    }
  }


  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


  async function registerForPushNotificationsAsync() {
    let token;

    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Os avisos de hidratação só ocorrerão se você os autorizar.');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      //alert('As notificações não funcionarão em emuladores.');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }


  useEffect(() => {

    //DEVE-SE usar uma variável booleana, no início de todo useEffect, para evitar o reinício repetido
    //de tudo o que estiver dentro dele e, TAMBÉM, para evitar o erro de TENTATIVA DE REGISTRO DE DUAS
    //TELAS COM O MESMO NOME.
    let executar = true;


    async function pegaPrimeiraTela() {
      await informaPrimeiraTela();
    }

    //APÓS ISSO, deve-se envolver em um IF, TUDO O QUE PRECISAR SER EXECUTADO 1 SÓ VEZ 
    if (executar) {

      iniciaTudo().then(
        pegaPrimeiraTela()
      );

      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);

      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    }

    //Ouvinte, que altera o state, sempre que a variável global mudar. 
    //VarGlobais.glMetaMililitros.addEventListener('change', ()=>{setMetaDiaria(VarGlobais.glMetaMililitros); console.log('Mudei a meta de mililitros para: ' + arGlobais.glMetaMililitros)});

    //Ouvinte que monitora se o app está em primeiro ou segundo plano
    //Quando ele varia de um plano para o outro, a função 'aFazerQuandoMudarOEstado' é chamada 
    //##### MANTER NESSA ORDEM, JÁ QUE A FUNÇÃO 'aFazerQuandoMudarOEstado' chama a função assíncrona 'zeraMlBebidosSeVirarODia', pois, como esta última
    //terá AWAIT antes dela, isso pode travar o registro dos listeners dos alarmes #######
    //AppState.addEventListener('change', aFazerQuandoMudarOEstado);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      //AppState.removeEventListener("change", aFazerQuandoMudarOEstado);

      //POR FIM, aqui, no retorno do usseEffect (que é chamado de "limpeza"), seta-se a variável para FALSE
      //para que, quando o fluxo passar novamente pelo useEffect, todas as funções acima 
      //NÃO SEJAM EXECUTADAS, NOVAMENTE.
      executar = false;

    };
  }, []);


  async function aFazerQuandoMudarOEstado(estadoDoApp) {
    if (estadoDoApp == "active") {   //Quando o app estiver em primeiro plano

      console.log('abri');

    }
  };




  //########################################################################################
  //>>>>>>>> RETORNO DA PÁGINA <<<<<<<<<<
  //########################################################################################
  //DECIDE POR QUE PÁGINA INICIAR, DE ACORDO COM OS DADOS DO USUÁRIO PREENCHIDOS
  //########################################################################################


  // if (navNormal) {
  //   console.log('HHHHHHHHHHHHHHH No if, indo para a navegação NORMAL.');
  return qualNavegacao();
  //return navegacaoNormal();
  // } else {
  //   console.log('HHHHHHHHHHHHHHH No if, indo para a navegação INICIAL.');
  //   return navegacaoInicial(false);
  // }








  function qualNavegacao() {


    return (
      <NavigationContainer>

        {navNormal ?

          <Pilha.Navigator initialRouteName='normal'>

            <Pilha.Screen
              component={navegacaoNormal}
              name='normal'
              options={{ headerShown: false, title: '...' }}
            />


            <Pilha.Screen
              component={telaGenero}
              name='genero'
              options={{ headerShown: false, title: '...' }}
            />



            <Pilha.Screen
              component={telaIdadeMulher}
              name='idadeM'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaIdadeHomem}
              name='idadeH'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaPeso}
              name='peso'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaAcordar}
              name='acordar'
              options={{
                title: '...',
                headerStyle: {
                  backgroundColor: '#0064A6',
                },
                headerTintColor: '#fff'


              }}
            />

            <Pilha.Screen
              component={telaDormir}
              name='dormir'
              options={{
                title: '...',
                headerStyle: {
                  backgroundColor: '#0064A6',
                },
                headerTintColor: '#fff'
              }}
            />

            <Pilha.Screen
              component={telaProgresso}
              name='progresso'
              options={{ headerShown: false }}
            />




            <Pilha.Screen
              component={telaFinalizado}
              name='finalizado'
              options={{
                headerShown: false,
              }}
            />


          </Pilha.Navigator>


          :


          <Pilha.Navigator initialRouteName='inicio'>

            <Pilha.Screen
              component={TelaInicio}
              name='inicio'
              options={{ headerShown: false, title: '...' }}
            />

            <Pilha.Screen
              component={navegacaoNormal}
              name='normal'
              options={{ headerShown: false, title: '...' }}
            />

            <Pilha.Screen
              component={telaGenero}
              name='genero'
              options={{ headerShown: false, title: '...' }}
            />

            <Pilha.Screen
              component={telaIdadeMulher}
              name='idadeM'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaIdadeHomem}
              name='idadeH'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaPeso}
              name='peso'
              options={
                {
                  title: '...',
                  headerStyle: {
                    backgroundColor: '#0064A6',
                  },
                  headerTintColor: '#fff'
                }
              }
            />

            <Pilha.Screen
              component={telaAcordar}
              name='acordar'
              options={{
                title: '...',
                headerStyle: {
                  backgroundColor: '#0064A6',
                },
                headerTintColor: '#fff'


              }}
            />

            <Pilha.Screen
              component={telaDormir}
              name='dormir'
              options={{
                title: '...',
                headerStyle: {
                  backgroundColor: '#0064A6',
                },
                headerTintColor: '#fff'
              }}
            />

            <Pilha.Screen
              component={telaProgresso}
              name='progresso'
              options={{ headerShown: false }}
            />




            <Pilha.Screen
              component={telaFinalizado}
              name='finalizado'
              options={{
                headerShown: false,
              }}
            />









          </Pilha.Navigator>

        }


      </NavigationContainer >
    );
  }


  function navegacaoInicial() {


    return (


      <Pilha.Navigator >

        <Pilha.Screen
          component={navegacaoNormal}
          name='telaPrinc'
          options={{
            title: 'Hidrate-se',
            headerShown: false,
          }}
        />

        <Pilha.Screen
          component={telaGenero}
          name='genero'
          options={{ headerShown: false, title: '...' }}
        />

        <Pilha.Screen
          component={telaIdadeMulher}
          name='idadeM'
          options={
            {
              title: '...',
              headerStyle: {
                backgroundColor: '#0064A6',
              },
              headerTintColor: '#fff'
            }
          }
        />

        <Pilha.Screen
          component={telaIdadeHomem}
          name='idadeH'
          options={
            {
              title: '...',
              headerStyle: {
                backgroundColor: '#0064A6',
              },
              headerTintColor: '#fff'
            }
          }
        />

        <Pilha.Screen
          component={telaPeso}
          name='peso'
          options={
            {
              title: '...',
              headerStyle: {
                backgroundColor: '#0064A6',
              },
              headerTintColor: '#fff'
            }
          }
        />

        <Pilha.Screen
          component={telaAcordar}
          name='acordar'
          options={{
            title: '...',
            headerStyle: {
              backgroundColor: '#0064A6',
            },
            headerTintColor: '#fff'


          }}
        />

        <Pilha.Screen
          component={telaDormir}
          name='dormir'
          options={{
            title: '...',
            headerStyle: {
              backgroundColor: '#0064A6',
            },
            headerTintColor: '#fff'
          }}
        />

        <Pilha.Screen
          component={telaProgresso}
          name='progresso'
          options={{ headerShown: false }}
        />




        <Pilha.Screen
          component={telaFinalizado}
          name='finalizado'
          options={{
            headerShown: false,
          }}
        />


      </Pilha.Navigator>
    );
  }




  function navegacaoNormal() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <Pilha2.Navigator initialRouteName={'telaPrinc2'}
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: '#87CEFA', height: 5 },

          }}
        >

          <Pilha2.Screen
            component={telaPrincipal}
            name='telaPrinc2'

            options={{
              // tabBarLabel: 'Controle',
              // tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
              tabBarShowLabel: false,
              tabBarIcon: () => {
                return (
                  <View>
                    <Image
                      source={Nivel}
                      fadeDuration={0}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                )
              },
              tabBarStyle: {
                height: 65,
              },

              headerShown: false,
            }}
          />

          <Pilha2.Screen
            component={telaAlarmes}
            name='alarmes2'
            options={{
              // tabBarLabel: 'Alarmes',
              // tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
              tabBarShowLabel: false,
              tabBarIcon: () => {
                return (
                  <View>
                    <Image
                      source={Alarme}
                      fadeDuration={0}
                      style={{ width: 35, height: 35 }}
                    />
                  </View>
                )
              },

              tabBarStyle: {
                height: 65

              },

              headerShown: false,
            }}
          />

          <Pilha2.Screen
            component={telaDashBoard}
            name='dashBoard'
            options={{
              tabBarShowLabel: false,
              tabBarIcon: () => {
                return (
                  <View>
                    <Image
                      source={Estatistica}
                      fadeDuration={0}
                      style={{ width: 35, height: 35 }}
                    />
                  </View>
                )
              },

              tabBarStyle: {
                height: 65,

              },

              headerShown: false,
            }}
          />




          <Pilha2.Screen
            component={telaAjustes}
            name='finalizado3'
            options={{
              // tabBarLabel: 'Ajustes',
              // tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
              tabBarShowLabel: false,
              tabBarIcon: () => {
                return (
                  <View>
                    <Image
                      source={Controle}
                      fadeDuration={0}
                      style={{ width: 35, height: 35 }}
                    />
                  </View>
                )
              },

              tabBarStyle: {
                height: 65,

              },

              headerShown: false,
            }}
          />


        </Pilha2.Navigator>

      </SafeAreaView>
    );
  }













}  //FIM DA FUNÇÃO PRINCIPAL DA PÁGINA














