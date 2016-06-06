var filaLogicFactory = require('./services/fila.js')
//var filasRepositoryFactory = require('./data/turnoRepository.js')
var comConfig = { type: 'tcp', port: 1225, host: 'localhost', };
var eventBrokerFactory = require('./facades/eventBrokerFacade.js')

function filaPlugin(options) {
    var filasLogic;
    var comConfig;
    var eventClient;
    var seneca = this;
    
    var tomaTurnoPattern = { role: 'fila', cmd: 'tomaTurnoEvento' };
    var cancelaTurnoPattern = { role: 'fila', cmd: 'cancelaTurnoEvento' };
    
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
        var fila = { id: 1, idCaja: 31, turnos: [{ id: 1 }, { id: 2 }, { id: 3 }] };
        respond(null, fila)
    }
    
    function abrirFila(msg, respond) {
        var cajaId = msg.cajaId;
        filasLogic.abrirFila(cajaId, function (err, fila) {
            var ok = !err
            var msg = { ok: ok, response: fila }
            respond(null, msg);
        });
    }
    
    function siguienteTurno(msg, respond) {
        var filaId = msg.filaId;
        filasLogic.siguienteTurno(filaId, function (err, operationDone) {
            var noError = !err
            var msg = { ok: noError, response: operationDone }
            respond(null, msg);
        });
    }
    
    function tomaTurnoEvento(msg, respond) {
        console.log("evento recibido", msg.eventArgs);

        var eventArgs = msg.eventArgs;
        var idFila = eventArgs.filaId;
        var idTurno = eventArgs.turnoId;
        
        filasLogic.tomaTurnoEvento(idFila, idTurno, function (err, operationDone) {
            
            var noError = !err
            var msg = { ok: noError, response: operationDone }
            respond(null, msg);
            
            respond();
        });
    }
    
    function cancelaTurnoEvento(msg, respond) {
        console.log("evento recibido", msg.eventArgs);

        var eventArgs = msg.eventArgs;
        var idFila = eventArgs.filaId;
        var idTurno = eventArgs.turnoId;
        
        filasLogic.tomaTurnoEvento(idFila, idTurno, function (err, operationDone) {
            
            var noError = !err
            var msg = { ok: noError, response: operationDone }
            respond(null, msg);
            
            respond();
        });

    }
    
    function init(msg, respond) {
        console.log("Iniciando microservicio filas...");
        
        var dbFila = options.dbFila;
        eventClient = options.eventBrokerClient;
        
        filasLogic = new filaLogicFactory(dbFila, eventClient);
        
        eventClient.subscribeToEvent(1, tomaTurnoPattern, console.log("ok"))
        eventClient.subscribeToEvent(2, cancelaTurnoPattern, console.log("ok"))
        
        respond();
        console.log("El microservicio de filas se inició con éxito!");
    }
}



//TODO: implemetntar logica en capa services
var seneca = require('seneca')()
.use('entity')
.use(filaPlugin, { dbFila: null, eventBrokerClient: new eventBrokerFactory(comConfig) })
.listen(comConfig)






