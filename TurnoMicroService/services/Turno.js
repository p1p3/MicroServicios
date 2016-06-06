var logicaNegocio = function Turno(turnoRepository, filasClient, eventClient) {

    var estadosTurno = {
        EnEspera: {
            id: 1,
            name: "En espera"
        },
        EnAtencion: {
            id: 2,
            name: "En atención"
        },
        Cancelado: {
            id: 3,
            name: "Cancelado"
        },
        Finalizado: {
            id: 4,
            name: "Finalizado"
        }
    }

    var getStateName = function(idEstado) {
        idEstado = Number(idEstado).valueOf()
        switch (idEstado) {
            case 1:
                return estadosTurno.EnEspera.name;
            case 2:
                return estadosTurno.EnAtencion.name;
            case 3:
                return estadosTurno.Cancelado.name;
            case 4:
                return estadosTurno.Finalizado.name;
            default:
                return "No existe";
        }
    }

    return {
        tomarTurno: function(idCliente, idSede, fn) {
            filasClient.obtenerFilaDisponible(idSede, function(err, fila) {
                if (!err && fila) {

                    var cantidadPersonasFila = fila.turnos.length;
                    var TiempoRestante = cantidadPersonasFila * 10;
                    var EstadoInicialTurno = cantidadPersonasFila == 0 ? estadosTurno.EnAtencion.id : estadosTurno.EnEspera.id
                    var turno = {
                        codigoFila: fila.id,
                        Estado: EstadoInicialTurno,
                        Numero: cantidadPersonasFila + 1,
                        TiempoRestante: TiempoRestante,
                        CodigoPago: idCliente
                    }

                    turno = turnoRepository.create(turno, function(err, turno) {
                        if (!err) {
                            eventClient.emitTurnoAsignadoEvent(turno);
                        }
                        fn(err, turno);
                    });
                }
                else {
                    fn(err, null);
                }


            });
        },
        cancelarTurno: function(idTurno, fn) {
            turnoRepository.getTurnoById(idTurno, function(err, turnoACancelar) {
                if (!err && turnoACancelar) {
                    if (turnoACancelar.Estado == estadosTurno.EnEspera.id) {
                        turnoACancelar.Estado = estadosTurno.Cancelado.id;
                        turnoRepository.update(turnoACancelar, function(err, turno) {
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
                }
                else {
                    fn(err, false);
                }
            });
        },
        consultarPuesto: function(idTurno, fn) {
            turnoRepository.getTurnoById(idTurno, function(err, turno) {
                if (!err && turno) {
                    console.log(turno);
                    filasClient.puestoTurno(turno.codigoFila, turno.id, function(err, response) {
                        console.log(response);
                        if (!err) {
                            turno.Numero = response.result;
                            turnoRepository.update(turno, function(err, turno) {
                                fn(err, turno.Numero);
                            });
                        }
                        else {
                            fn(err, -1);
                        }
                    });
                }
                else {
                    fn("turno no encontrado", -1);
                }
            });
        },
        setEnAtencion: function(idTurno, fn) {
            turnoRepository.getTurnoById(idTurno, function(err, turno) {
                console.log("set en action inner", turno);
                if (!err && turno) {
                    turno.Estado = estadosTurno.EnAtencion.id
                    turnoRepository.update(turno, function(err, turno) {
                        console.log("set en action inner update", turno);
                        if (fn) fn(err, turno);
                    })
                }
                else {
                    if (fn) fn("turno no encontrado", null);
                }
            });
        },
        finalizarTurno: function(idTurno, fn) {
            turnoRepository.getTurnoById(idTurno, function(err, turno) {
                if (!err && turno) {
                    turno.Estado = estadosTurno.Finalizado.id
                    turnoRepository.update(turno, function(err, turno) {
                      if (fn)  fn(err, true);
                    })
                }
                else {
                    if (fn) fn("turno no encontrado", null);
                }
            });
        },
        estadoTurno: function(idTurno, fn) {
            turnoRepository.getTurnoById(idTurno, function(err, turno) {
                if (!err && turno) {
                    var nombre = getStateName(turno.Estado);
                    if (fn) fn(err, nombre);
                }
                else {
                    if (fn) fn("turno no encontrado", null);
                }
            });
        },
        siguienteTurnoEvento: function(siguienteTurno, turnoAnterior, fn) {
            this.finalizarTurno(turnoAnterior.turnoId);
            this.setEnAtencion(siguienteTurno.turnoId, function(err, turno) {
                fn(err, !err);
            })
        }
    }
}

module.exports = logicaNegocio;
