var turnosRepository = function (){
    return {
        create : function (turno){
            turno.id = "asdad";
            return turno;
        },
        update: function (turno){
            return turno;
        },
        getTurnoById : function (idTurno){
            var turno = {
                codigoFila: 1, 
                Estado : "EnEspera",
                Numero: 5  ,
                TiempoRestante : 10,
                CodigoPago : "asdsad",
                id: "asdad"
            };

            return turno;
        },
    }
}

module.exports = turnosRepository;