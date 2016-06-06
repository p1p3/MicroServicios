var logicaNegocio = function fila(filaRepository, eventClient) {
    return {
        filaDisponible: function(idSede, fn) {
            //TODO: Traerlo de base de datos
            var query = {
                caja: {
                    idSede: idSede
                }
            };
            filaRepository.list(query, function(err, filas) {
                fn(err, filas)
            });
        },
        abrirFila: function(caja, fn) {
            var idCaja = caja.id;
            this.existeFilaCaja(idCaja, function(err, existe) {
                if (!err && !existe) {
                    var fila = {
                        caja: caja,
                        turnos: []
                    };

                    filaRepository.create(fila, function(err, fila) {
                        fn(err, fila);
                    });

                }
                else {
                    fn(err, null);
                }

            });
        },
        existeFilaCaja: function(idCaja, fn) {
            var err = null;
            var existe = false;
            fn(err, existe);
        },
        siguienteTurno: function(idFila, fn) {
            filaRepository.findById(idFila, function(err, fila) {
                if (fila.turnos.length > 0) {
                    fila.turnos.shift();
                    //TODO: lanzar evento siguiente turno
                }

                var ok = !err;
                fn(err, ok);
                if (fila.turnos.length > 0) {
                    var siguienteTurno = fila.turnos[0];
                    //TODO: lanzar evento siguiente turno
                }

            });
        },
        tomaTurnoEvento: function(filaId, turnoId, fn) {
            filaRepository.findById(filaId, function(err, fila) {
                if (!err && fila) {
                    var nuevoTurno = {
                        idTurno: turnoId
                    };

                    fila.turnos.push(nuevoTurno);
                    filaRepository.update(fila, function(err, fila) {
                        fn(err, fila);
                    });
                }
                else {
                    fn(err, fila);
                }
            });
        },
        cancelaTurnoEvento: function(filaId, turnoId, fn) {
            filaRepository.findById(filaId, function(err, fila) {
                console.log("logica filas");
                if (!err) {

                    fila.turnos = removerTurnoFila(fila.turnos, turnoId);

                    filaRepository.update(fila, function(err, fila) {
                        fn(err, fila);
                    });
                }
                else {
                    fn(err, fila);
                }
            });
        }
    }

    function  removerTurnoFila(turnosFila, turnoId) {
        var filaToReturn = fila;

        for (var i = 0; i < turnosFila.length; i++) {
            var turno = turnosFila[i];
            if (turno.idTurno == turnoId) {
                turnosFila.splice(i, 1);
            }
        }

        return filaToReturn;
    }
}

module.exports = logicaNegocio;