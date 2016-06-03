﻿//var filaLogicFactory = require('./services/Turno.js')
//var filasRepositoryFactory = require('./data/turnoRepository.js')

function filaPlugin(options) {
    var filasLogic;

    //Operaciones
    this.add('role:fila,cmd:abrirFila', abrirFila)
    this.add('role:fila,cmd:siguienteTurno', siguienteTurno)
    this.add('role:fila,cmd:filaDisponible', filaDisponible)

    //Eventos
    this.add('role:evento,cmd:tomaTurno', tomaTurnoEvento)
    this.add('role:evento,cmd:cancelaTurno', cancelaTurnoEvento)

    //Inicialización
    this.add({ init: filaPlugin }, init)

    function  filaDisponible(msg, respond) {
        var fila = { id: 1, turnos: [{ id: 1 }, { id: 2 }, { id: 3 }] };
        respond(null, fila)
    }

    function abrirFila(msg, respond) {
        filasLogic.tomarTurno(msg.idCaja, function (err, caja) {
            var out = { answer: caja }
            respond(null, out)
        });
    }

    function siguienteTurno(msg, respond) {
        filasLogic.cancelarTurno(msg.idTurno, function (err, ok) {
            var out = { answer: ok }
            respond(null, out)
        });
    }

    function tomaTurnoEvento(msg, respond) {
        filasLogic.agregarTurnoFila(msg.idTurno, msg.idCaja, function (err, ok) {
            var out = { answer: ok }
            respond(null, out)
        });
    }

    function cancelaTurnoEvento(msg, respond) {
        filasLogic.cancelarTurnoFila(msg.idTurno, msg.idCaja, function (err, ok) {
            var out = { answer: ok }
            respond(null, out)
        });
    }

    function init(msg, respond) {
        console.log("Iniciando microservicio filas...");
        var dbFila = options.dbFila;
        //  filasLogic = new filaLogicFactory(dbFila);
        respond();
        console.log("El microservicio de filas se inició con éxito!");
    }
}

var seneca = require('seneca')().use('entity');

seneca
.use(filaPlugin, { dbFila: null })
.listen({ type: 'tcp', port: 1225, host: 'localhost', })