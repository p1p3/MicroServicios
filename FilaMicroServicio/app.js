//var filaLogicFactory = require('./services/Turno.js')
//var filasRepositoryFactory = require('./data/turnoRepository.js')
var comConfig = { type: 'tcp', port: 1225, host: 'localhost', };
var eventBrokerFactory = require('./facades/eventBrokerFacade.js')

function filaPlugin(options) {
    var filasLogic;
    var comConfig;
    var eventClient;
    var seneca = this;
    
    var tomaTurnoPattern = { role: 'fila', cmd: 'tomaTurnoEvento' };
    var cancelaTurnoPattern = {role: 'fila',cmd: 'cancelaTurnoEvento'};

    //Operaciones
    this.add('role:fila,cmd:abrirFila', abrirFila)
    this.add('role:fila,cmd:siguienteTurno', siguienteTurno)
    this.add('role:fila,cmd:filaDisponible', filaDisponible)

    //Eventos
    this.add(tomaTurnoPattern, tomaTurnoEvento)
    this.add(cancelaTurnoPattern, cancelaTurnoEvento)

    //Inicialización
    this.add({ init: filaPlugin }, init)

    function  filaDisponible(msg, respond) {
        //TODO: Traerlo de base de datos
        var fila = { id: 1, turnos: [{ id: 1 }, { id: 2 }, { id: 3 }] };
        respond(null, fila)
    }

    function abrirFila(msg, respond) {
          //TODO: crea fila para sede
    }

    function siguienteTurno(msg, respond) {
        //TODO: remover turnod e la fila       
    }

    function tomaTurnoEvento(msg, respond) {
        //TODO: remover turnod e la fila
        console.log("evento recibido", msg.eventArgs);
        respond();
    }

    function cancelaTurnoEvento(msg, respond) {
        console.log("evento recibido", msg.eventArgs);
        respond();
    }

    function init(msg, respond) {
        console.log("Iniciando microservicio filas...");
  
        var dbFila = options.dbFila;
        eventClient = options.eventBrokerClient;

        eventClient.subscribeToEvent(1, tomaTurnoPattern,console.log("ok"))
        eventClient.subscribeToEvent(2, cancelaTurnoPattern, console.log("ok"))

        respond();
        console.log("El microservicio de filas se inició con éxito!");
    }
}



//TODO: implemetntar logica en capa services
var seneca = require('seneca')()
.use('entity')
.use(filaPlugin, { dbFila: null, eventBrokerClient: new eventBrokerFactory(comConfig)})
.listen(comConfig)






