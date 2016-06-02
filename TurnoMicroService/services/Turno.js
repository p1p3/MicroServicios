var logicaNegocio = function Turno(dbTurno, filasClient) {
    return {
        tomarTurno: function (idCliente) {
            var fila = filasClient.obtenerFilaDisponible();
            var cantidadPersonasFila = fila.Turnos.length;
            var TiempoRestante = cantidadPersonasFila * 10;
            var turno = {
                codigoFila: fila.Id, 
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
                dbTurno.Update(turnoACancelar);
                return true;
            }
            else {
                return false;
            }
        },
        consultarPuesto: function (idTurno) {
            var turno = dbTurno.getTurnoById(idTurno);
            return turno;
        }
    }
}

//Estado:
/*EnEspera
 *EnAtencion
 *Cancelado
 *Finalizado*/

module.exports = logicaNegocio;