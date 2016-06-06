var logicaNegocio = function Turno(dbTurno
    , filasClient, eventClient) {
    
    var estadosTurno = {
        EnEspera: { id: 1, name: "En espera" } ,
        EnAtencion: { id: 2, name: "En atención" } ,
        Cancelado : { id: 3, name: "Cancelado" } ,
        Finalizado : { id: 4, name: "Finalizado" }
    }
    
    return {
        tomarTurno: function (idCliente, idSede, fn) {
            filasClient.obtenerFilaDisponible(idSede, function (err, fila) {
                if (!err) {
                    var cantidadPersonasFila = fila.turnos.length;
                    var TiempoRestante = cantidadPersonasFila * 10;
                    var turno = {
                        codigoFila: fila.id,
                        Estado : estadosTurno.EnEspera.id,
                        Numero: cantidadPersonasFila + 1 ,
                        TiempoRestante : TiempoRestante,
                        CodigoPago : idCliente
                    }
                    
                    turno = dbTurno.create(turno, function (err, turno) {
                        if (!err) {
                            eventClient.emitTurnoAsignadoEvent(turno);
                        }
                        fn(err, turno);
                    });
                } else {
                    fn(err, null);
                }

               
            });
        },
        cancelarTurno: function (idTurno, fn) {
            dbTurno.getTurnoById(idTurno, function (err, turnoACancelar) {
                if (!err && turnoACancelar) {
                    if (turnoACancelar.Estado == estadosTurno.EnEspera.id) {
                        turnoACancelar.Estado = estadosTurno.Cancelado.id;
                        dbTurno.update(turnoACancelar, function (err, turno) {
                            var ok = !err;
                            if (ok) {
                                eventClient.emitirTurnoCanceladoEvent(turno);
                            }
                            fn(err, ok);
                        });
                    }
                    else {
                        fn(err, false);
                    }
                } else {
                    fn(err, false);
                }
            });
        },
        consultarPuesto: function (idTurno, fn) {
            //TODO: consultarlo de el servicio de filas, y actualizar el turno en bd
            dbTurno.getTurnoById(idTurno, function (err, turno) {
                if (!err && turno) {
                    fn(err, turno.Numero);
                } else {
                    fn(err, -1);
                }
            });
        }
    }
}

module.exports = logicaNegocio;