var turnosRepository = function (senecaDI){
    var self = this;
    var seneca = senecaDI;
    return {
        create : function (turno, fn){
            turno.id = "asdad";
            var dbTurno = self.seneca.make('turno');
            
            dbTurno = self.mergeTurno(turno, dbTurno);
            /*
            dbTurno.codigoFila = turno.codigoFila;
            dbTurno.Estado = turno.Estado;
            dbTurno.Numero = turno.Numero;
            dbTurno.TiempoRestante = turno.TiempoRestante;
            dbTurno.CodigoPago = turno.CodigoPago;*/

            dbTurno.save$(function (err, dbTurno) {
                fn(err, dbTurno);
            });
            
        },
        update: function (turno,fn){
            var dbTurno = self.seneca.make('turno');

            dbTurno.load$(turno.id, function (err, dbTurno) {
                if (!err) {
                    this.dbTurno = mergeTurno(turno, dbTurno);
                    this.dbTurno.save$(function (err, dbTurno) {
                        fn(err, dbTurno);
                    });
                } else{
                    fn(err, this.dbTurno);
                }
            });
        },
        getTurnoById : function (idTurno,fn){
            var dbTurno = self.seneca.make('turno');
            dbTurno.load$(turno.id, function (err, dbTurno) {
                    fn(err, dbTurno);
            });
        },
    }
    
    function mergeTurno(turno, dbTurno) {
        // combine the two options objects
        for (var key in turno) {
            dbTurno[key] = turno[key];
        }
        return dbTurno;
    }



}

module.exports = turnosRepository;