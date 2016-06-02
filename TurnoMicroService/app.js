var TurnoLogicFactory = require('./services/Turno.js')

function turnoPlugin(options) {
    var turnoLogic;
    
    //Operaciones
    this.add('role:turno,cmd:tomar', tomarTurno)
    this.add('role:turno,cmd:cancelar', cancelarTurno)
    this.add('role:turno,cmd:consultarPuesto', consultarPuesto)
    
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
        var dbTurno = msg.dbTurno;
        var filasClient = msg.filasClient;
        turnoLogic = new TurnoLogicFactory(db, filasClient);
        respond();
        console.log("Se inició con éxito!");
    }
    
    function parseIntegers(msg, respond) {
        msg.left = Number(msg.left).valueOf()
        msg.right = Number(msg.right).valueOf()
        this.prior(msg, respond)
    }

}

require('seneca')()
  .use(turnoPlugin, { dbTurno:null , filasClient: null })
   .listen({ type: 'tcp', port: 1223, host: 'localhost', })
