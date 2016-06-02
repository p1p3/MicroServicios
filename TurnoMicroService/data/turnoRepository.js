var turnosRepository = function (){
    return {
        create : function (turno){
            turno.id = "asdad";
            return turno;
        },
        update: function (turno){
            //
        },
        getTurnoById : function (idTurno){
            var turno = {
                codigoFila: fila.id, 
                Estado : "EnEspera",
                Numero: cantidadPersonasFila  ,
                TiempoRestante : TiempoRestante,
                CodigoPago : idCliente,
                id: "asdad"
            };

            return turno;
        },
    }
}

module.exports = turnosRepository;