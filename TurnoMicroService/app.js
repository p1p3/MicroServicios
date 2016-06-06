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

    //Eventos

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

    function init(msg, respond) {
        console.log("Iniciando microservicio turnos...");
        var dbTurno = options.dbTurno;
        var filasClient = options.filasClient;
        var eventClient = options.eventClient;
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
        eventClient: new eventBrokerFactory()
    })
    .listen(comConfig)
 /*  .act('role:turno, cmd:tomar, idCliente:1,idSede:sedePrueba', function(err, response) {
        var turno = response.answer;
        seneca.act({
            role: 'turno',
            cmd: 'consultarTurno',
            idTurno: turno.id,
            idCaja: turno.codigoFila
        }, console.log)
    })*/