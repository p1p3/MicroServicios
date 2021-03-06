var turnosRepository = function (){
    var dataSource = require('seneca')().use('entity');
    
    return {
        create : function (turno, fn){

            var dbTurno = dataSource.make('turno');

            dbTurno = mergeTurno(turno, dbTurno);

            dbTurno.save$(function (err, dbTurno) {
                fn(err, dbTurno);
            });
            
        },
        update: function (turno,fn){
            var dbTurno = dataSource.make('turno');

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
            var dbTurno = dataSource.make('turno');
            dbTurno.load$(idTurno, function (err, dbTurno) {
                    fn(err, dbTurno);
            });
        },
    }
    
    function mergeTurno(turno, dbTurno) {
        for (var key in turno) {
            dbTurno[key] = turno[key];
        }
        return dbTurno;
    }



}

module.exports = turnosRepository;
