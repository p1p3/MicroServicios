var logicaNegocio = function Turno(dbTurno, filasClient, fn) {
    return {
        tomarTurno: function (idCliente) {
            var fila = filasClient.obtenerFilaDisponible();
            var cantidadPersonasFila = fila.turnos.length;
            var TiempoRestante = cantidadPersonasFila * 10;
            var turno = {
                codigoFila: fila.id, 
                Estado : "EnEspera",
                Numero: cantidadPersonasFila  ,
                TiempoRestante : TiempoRestante,
                CodigoPago : idCliente
            }
            
            turno = dbTurno.create(turno, function (err, Turno) {
                fn(err, turno);
            });
        },
        cancelarTurno: function (idTurno, fn) {
            dbTurno.getTurnoById(idTurno, function (err, turnoACancelar) {
                if (!err && turnoACancelar) {
                    if (turnoACancelar.Estado == "EnEspera") {
                        turnoACancelar.Estado = "Cancelado";
                        dbTurno.update(turnoACancelar, function (err, turno) {
                            var ok = !err;
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

//Estado:
/*EnEspera
 *EnAtencion
 *Cancelado
 *Finalizado*/

module.exports = logicaNegocio;