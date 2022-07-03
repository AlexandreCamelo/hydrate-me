import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import VarGlobais from '../../Global'
import { gerarPlanoHidratacao } from '../../funcoes/GeracaoAlarmes';
import FundoAgua from '../imagens/fundoAgua4.jpg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';




function telaProgresso({ navigation }) {
    const [progresso, setProgresso] = useState(0.2);

    //Controla o comportamento da tecla 'voltar', no hardware de cada celular (só para android)
    BackHandler.addEventListener("hardwareBackPress", () => { navigation.navigate('dormir'); return true });


    async function progressando() {
        setProgresso(30);
        //Gera plano de hidratação, já jogando todas as informações
        //nas variáveis globais, que serão usadas na função a seguir: 'incluirDadosUsuario'
        var gerouPlano = await gerarPlanoHidratacao(true, 'desl', 'desl', 'desl', 'desl', 'desl', 'desl', 'desl');
        setProgresso(60);
        console.log('VALOR DE ´GEROUPLANO´:' + gerouPlano);

        //Só inclui os dados do usuário se tiver sucesso 
        //na geração do o plano de hidratação
        if (gerouPlano == 'true') {
            console.log('O plano de hidratação foi gerado, então... Vou incluir os dados do usuário.');
            console.log('Antes de incluir os dados do usuário, essa é a porção de água: ' + VarGlobais.glPorcaoAgua);

            setProgresso(100);
            navigation.navigate('normal');

        } else {
            console.log('O plano NÃO foi gerado. FALSE foi retornado.')
        }




    }


    useEffect(() => {
        //DEVE-SE usar uma variável booleana, no início de todo useEffect, para evitar o reinício repetido
        //de tudo o que estiver dentro dele e, TAMBÉM, para evitar o erro de TENTATIVA DE REGISTRO DE DUAS
        //TELAS COM O MESMO NOME.
        let executar = true;

        if (executar) {
            progressando();
        } 
        
        return () => {
            executar = false;
        }

    }, []);





    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <ImageBackground source={FundoAgua} style={Estilos.fundo}>


               
                <AnimatedCircularProgress
                    size={300}
                    width={20}
                    fill={progresso}
                    tintColor="#00e0ff"
                    backgroundColor="#3d5875"
                    rotation={0}
                    >
                    {
                        () => (
                            <>
                                <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#FFF' }}>{progresso + '%'}</Text>
                            </>
                        )
                    }
                </AnimatedCircularProgress>
              
                <Text style={Estilos.texto}>Preparando tudo...</Text>


            </ImageBackground>
        </View>
    )
}


export {
    telaProgresso,
}



const Estilos = StyleSheet.create({
    fundo: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'repeat',
    },

    texto: {

        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    }
})


