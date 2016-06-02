var logicaNegocio = function Turno(dbTurno, filasClient) {
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

            turno = dbTurno.create(turno);

            return turno;
        },
        cancelarTurno: function (idTurno) {
            var turnoACancelar = dbTurno.getTurnoById(idTurno);
            if (turnoACancelar.Estado == "EnEspera") {
                turnoACancelar.Estado = "Cancelado";
                dbTurno.update(turnoACancelar);
                return true;
            }
            else {
                return false;
            }
        },
        consultarPuesto: function (idTurno) {
            var turno = dbTurno.getTurnoById(idTurno);
            return turno.Numero;
        }
    }
}

//Estado:
/*EnEspera
 *EnAtencion
 *Cancelado
 *Finalizado*/

module.exports = logicaNegocio;