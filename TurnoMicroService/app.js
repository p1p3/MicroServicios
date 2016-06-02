var TurnoLogicFactory = require('./services/Turno.js')
var turnosRepositoryFactory = require('./data/turnoRepository.js')

function turnoPlugin(options) {
    var turnoLogic;
    
    //Operaciones
    this.add('role:turno,cmd:tomar,param:idCliente', tomarTurno)
    this.add('role:turno,cmd:cancelar,param:idTurno', cancelarTurno)
    this.add('role:turno,cmd:consultarPuesto,param:idTurno', consultarPuesto)
    
    //Wrappers
    this.wrap('role:turno', parseIntegers);
    
    
    //Inicialización
    this.add({ init: turnoPlugin }, init)
    
    
    function tomarTurno(msg, respond) {
        var result = turnoLogic.tomarTurno(msg.idCliente);
        var out = { answer: result }
        respond(null, out)
    }
    
    function cancelarTurno(msg, respond) {
        var result = turnoLogic.cancelarTurno(msg.idTurno);
        var out = { answer: result }
        respond(null, out)
    }
    
    function consultarPuesto(msg, respond) {
        var result = turnoLogic.consultarPuesto(msg.idTurno);
        var out = { answer: result }
        respond(null, out)
    }
    
    function init(msg, respond) {
        console.log("Iniciando microservicio...");
        var dbTurno = options.dbTurno;
        var filasClient = options.filasClient;
        turnoLogic = new TurnoLogicFactory(dbTurno, filasClient);
        respond();
        console.log("Se inició con éxito!");
    }
    
    function parseIntegers(msg, respond) {
        msg.left = Number(msg.left).valueOf()
        msg.right = Number(msg.right).valueOf()
        this.prior(msg, respond)
    }

}

var filasClientFactory = function filas() {
    return {
        obtenerFilaDisponible: function () {
            return {id: 1,turnos:5};
        }
    }
}

require('seneca')()
  .use(turnoPlugin, { dbTurno: new turnosRepositoryFactory() , filasClient: new filasClientFactory() })
   .listen({ type: 'tcp', port: 1223, host: 'localhost', })
   .act('role:turno,cmd:consultarPuesto,idTurno:asdad', console.log);
