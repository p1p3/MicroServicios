var logicaNegocio = function fila(dbFila, eventClient) {
    return {
        filaDisponible: function (idSede, fn) {
            //TODO: Traerlo de base de datos
         var fila = { id: 1, idCaja: 31, idSede:32, turnos: [{ id: 1 }, { id: 2 }, { id: 3 }] };
            fn(null, fila);
        },
        abrirFila: function (caja, fn) {
            var idCaja = caja.id;
            var idSede = caja.sede.id;
            this.existeFilaCaja(idCaja, function (err, existe) {
                if (!error && !existe) {
                    var caja = null;
                    var error = null;
                    
                    var fila = {
                        idCaja: idCaja,
                        idSede: idSede,
                        turnos: [{ id: 1 }, { id: 2 }, { id: 3 }]
                    };

                    dbFila.create(fila,function(err,fila){
                      fn(error, fila);
                    })
                    
                } else {
                                        fn(err, null);
                }

            })
        }, existeFilaCaja: function (idCaja, fn) {
            var err = null;
            var existe = false;
            fn(err, existe)
        },
        siguienteTurno: function (idFila, fn) {
            dbFila.findById(idFila, function (err, fila) {
                fila.turnos.shift();
                var ok = !err;
                fn(err, ok);
                if (fila.turnos.length > 0) {
                    var siguienteTurno = fila.turnos[0];
                    //TODO: lanzar evento siguiente turno
                }

            });
        }, tomaTurnoEvento: function (filaId, turnoId, fn) {
            dbFila.findById(filaId, function (err, fila) {
                if (!err && fila) {
                    fila.turnos.push({ id: turnoId });
                    dbFila.update(fila, function (err, fila) {
                        fn(err, fila);
                    });
                } else {
                    fn(err, fila);
                }
            });
        },
        cancelaTurnoEvento: function (filaId, turnoId, fn) {
            dbFila.findById(filaId, function (err, fila) {
                if (!err) {
                    var turno = fila.turnos.filter(function (turno) {
                        return turno.id == turnoId;
                    })
                    
                    var index = fila.turnos.indexOf(turno);
                    if (index > -1) {
                        fila.turnos.splice(index, 1);
                    }
                    
                    dbFila.update(fila, function (err, fila) {
                        fn(err, fila);
                    });
                } else {
                    fn(err, fila);
                }
            });
        }
    }
}

module.exports = logicaNegocio;