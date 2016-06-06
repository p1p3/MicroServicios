var _ = require('lodash');

var filaRepository = function() {
    var dataSource = require('seneca')().use('entity');
    return {
        create: function(fila, fn) {

            var dbFila = dataSource.make('fila');
            dbFila.caja = {
                idCaja: fila.caja.idCaja,
                idSede: fila.caja.idSede
            }
            dbFila.turnos = fila.turnos;

            dbFila.save$(function(err, dbFila) {
                fn(err, dbFila);
            });

        },
        update: function(fila, fn) {
            var dbFila = dataSource.make('fila');

            dbFila.load$(fila.id, function(err, dbFila) {
                if (!err) {
                    this.dbFila = mergeFila(fila, dbFila);
                    this.dbFila.save$(function(err, dbFila) {
                        fn(err, dbFila);
                    });
                }
                else {
                    fn(err, this.dbFila);
                }
            });
        },
        findById: function(idFila, fn) {
            var dbFila = dataSource.make('fila');
            dbFila.load$(idFila, function(err, dbFila) {
                fn(err, dbFila);
            });
        },
        list: function(query, fn) {
            var dbFila = dataSource.make('fila');

            dbFila.list$({}, function(err, list) {
                if(!err && list.length > 0){
                    //se filtra en memoria con lodash ya que no soporta filtros anidados
                   list =  _.find(list, query);
                }
                fn(err, list);
            })
        }
    }

    function mergeFila(fila, dbFila) {
        for (var key in dbFila) {
            dbFila[key] = fila[key];
        }
        return dbFila;
    }

}

module.exports = filaRepository;