var TurnoLogicFactory = require('./services/Turno.js')
var turnosRepositoryFactory = require('./data/turnoRepository.js')

function turnoPlugin(options) {
    var turnoLogic;
    
    //Operaciones
    this.add('role:turno,cmd:tomar', tomarTurno)
    this.add('role:turno,cmd:cancelar', cancelarTurno)
    this.add('role:turno,cmd:consultarTurno', consultarTurno)
    
    //Inicialización
    this.add({ init: turnoPlugin }, init)
    
    
    function tomarTurno(msg, respond) {
        turnoLogic.tomarTurno(msg.idCliente, function (err, turno) {
            var out = { answer: turno }
            respond(null, out)
        });
    }
    
    function cancelarTurno(msg, respond) {
        turnoLogic.cancelarTurno(msg.idTurno, function (err, ok) {
            var out = { answer: ok }
            respond(null, out)
        });
    }
    
    function consultarTurno(msg, respond) {
        turnoLogic.consultarPuesto(msg.idTurno, function (err, puesto) {
            var out = { answer: puesto }
            respond(null, out)
        });
    }
    
    function init(msg, respond) {
        console.log("Iniciando microservicio...");
        var dbTurno = options.dbTurno;
        var filasClient = options.filasClient;
        turnoLogic = new TurnoLogicFactory(dbTurno, filasClient);
        respond();
        console.log("Se inició con éxito!");
    }

}

//Mock para el servicio de filas
var filasClientFactory = function filas() {
    return {
        obtenerFilaDisponible: function () {
            return { id: 1, turnos: [{ id: 1 }, { id: 2 }, { id: 3 }] };
        }
    }
}

var seneca = require('seneca')().use('entity');

seneca
.use(turnoPlugin, { dbTurno: new turnosRepositoryFactory(seneca) , filasClient: new filasClientFactory() })
.listen({ type: 'tcp', port: 1224, host: 'localhost', })
   


