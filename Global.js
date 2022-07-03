class Global {

    static glBD;
    static glBD2;
    static glHoras = 0;
    static glMinutos = 0;
    static glSegundos = 0;

    static glSexo = '-';
    static glPeso = 0;
    static glPorcaoAgua;
    static glFaixaEtaria = '';
    static glMlPorKgAte17 = 40;
    static glMlPorKg18a55 = 35;
    static glMlPorKg56a65 = 30;
    static glMlPorKg66ouMais = 25;
    static glMetaMililitros = 0;
    static glHoraAcordar = null;
    static glHoraDormir = null;
    static glPeriodoDiario = 0;
    static glQtdeDiariaAlarmes = 0;
    static glIntervaloACadaAlarme = 0;

    static glHoraAcordarFormatoHora = new Date(Date.now());
    static glHoraDormirFormatoHora = new Date(Date.now());

    static glMlBebidos = 0;

    static glAlarmes = [];

    static glDadosUsuarioInformados = false;

}

export default Global;