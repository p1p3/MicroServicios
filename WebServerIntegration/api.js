module.exports = function api(options) {


    //http://localhost:3000/api/turno/tomar?idCliente=asd&idSede=asd
    //http://localhost:3000/api/turno/consultarTurno?idTurno=b8zrvd
    //http://localhost:3000/api/turno/cancelar?idTurno=b8zrv
    var valid_ops_turno = {
        tomar: 'tomar',
        cancelar: 'cancelar',
        consultarTurno: 'consultarTurno'
    }

    //https://microservicios-p1p3.c9users.io/api/fila/siguiente?filaId=asd
    //https://microservicios-p1p3.c9users.io/api/fila/abrir?idSede=yu7742&idCaja=n84tus
    //https://microservicios-p1p3.c9users.io/api/fila/puestoEnFila?turnoId=yu7742&filaId=n84tus
    var valid_ops_fila = {
        siguiente: 'siguienteTurno',
        abrir: 'abrirFila',
        puestoEnFila: 'puestoEnfila'
    }


    this.add('role:api,path:turno', function(msg, respond) {
        var query = {};

        query.role = 'turno';
        query.cmd = valid_ops_turno[msg.operation];
        

        if (msg.idTurno)
            query.idTurno = msg.idTurno;

        if (msg.idClient)
            query.idTurno = msg.idCliente;

        if (msg.idSede)
            query.idSede = msg.idSede;


        this.act(query, respond)
    })


    this.add('role:api,path:fila', function(msg, respond) {
       
        var query = {};

        query.role = 'fila';
        query.cmd = valid_ops_fila[msg.operation];
          
        if (msg.idSede)
            query.idSede = msg.idSede;

        if (msg.idCaja)
            query.idCaja = msg.idCaja;

        if (msg.filaId)
            query.filaId = msg.filaId;

        if (msg.turnoId)
            query.turnoId = msg.turnoId;

        console.log(query);
        this.act(query,respond)
    })



    this.add('init:api', function(msg, respond) {
        this.act('role:web', {
            use: {
                prefix: '/api',
                pin: 'role:api,path:*',
                map: {
                    fila: {
                        GET: true,
                        suffix: '/:operation'
                    },
                    turno: {
                        GET: true,
                        suffix: '/:operation'
                    }
                }
            }
        }, respond)
    })

}