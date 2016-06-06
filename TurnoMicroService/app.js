var TurnoLogicFactory = require('./services/Turno.js')
var turnosRepositoryFactory = require('./data/turnoRepository.js')
var filasFacadeFactory = require('./facades/filaServiceFacade.js')
var eventBrokerFactory = require('./facades/eventBrokerFacade.js')

var comConfig = {
    type: 'tcp',
    port: 1224,
    host: 'localhost',
};

function turnoPlugin(options) {
    var turnoLogic;

    //Operaciones
    this.add('role:turno,cmd:tomar', tomarTurno)
    this.add('role:turno,cmd:cancelar', cancelarTurno)
    this.add('role:turno,cmd:consultarTurno', consultarTurno)
    this.add('role:turno,cmd:consultarEstadoTurno', consultarEstadoTurno)


    var siguienteTurnoPattern = {
        role: 'turno',
        cmd: 'tomaTurnoEvento'
    };
    this.add(siguienteTurnoPattern, siguienteTurnoEvento)

    //Inicialización
    this.add({
        init: turnoPlugin
    }, init)

    function tomarTurno(msg, respond) {
        var idClient = msg.idCliente;
        var idSede = msg.idSede;
        turnoLogic.tomarTurno(idClient, idSede, function(err, turno) {
            var out = {
                answer: turno
            }
            respond(null, out)
        });
    }

    function cancelarTurno(msg, respond) {
        turnoLogic.cancelarTurno(msg.idTurno, function(err, ok) {
            var out = {
                answer: ok
            }
            respond(null, out)
        });
    }

    function consultarTurno(msg, respond) {
        turnoLogic.consultarPuesto(msg.idTurno, function(err, puesto) {
            var out = {
                answer: puesto
            }
            respond(null, out)
        });
    }


    function consultarEstadoTurno(msg, respond) {
        var turnoId = msg.idTurno;
        turnoLogic.estadoTurno(turnoId, function(err, estado) {
            var out = {
                answer: estado
            }
            respond(err, out)
        });
    }

    function siguienteTurnoEvento(msg, respond) {
        console.log("evento recibido siguienteTurno", msg.eventArgs);
        
        var eventArgs = msg.eventArgs;
        var siguienteTurno = eventArgs.siguienteTurno;
        var turnoFinalizado = eventArgs.turnoFinalizado;

        turnoLogic.siguienteTurnoEvento(siguienteTurno,turnoFinalizado, function(err, turnoSiguiente) {
            var out = {
                answer: turnoSiguiente
            }
            
            console.log("antes de responder ",out);
            respond(err, out)
        });
    }

    function init(msg, respond) {
        console.log("Iniciando microservicio turnos...");
        var dbTurno = options.dbTurno;
        var filasClient = options.filasClient;
        var eventClient = options.eventClient;

        eventClient.subscribeToEvent(3, siguienteTurnoPattern, console.log("Subscibiendo a evento de siguienteTurno"))

        turnoLogic = new TurnoLogicFactory(dbTurno, filasClient, eventClient);



        respond();
        console.log("El servicio de turnos se inició con éxito!");
    }
}

var seneca = require('seneca')().use('entity');

seneca
    .use(turnoPlugin, {
        dbTurno: new turnosRepositoryFactory(),
        filasClient: new filasFacadeFactory(seneca),
        eventClient: new eventBrokerFactory(comConfig)
    })
    .listen(comConfig)
