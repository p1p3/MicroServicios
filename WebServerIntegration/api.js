module.exports = function api(options) {


    //http://localhost:3000/api/turno/tomar?idCliente=asd&idSede=asd
    //http://localhost:3000/api/turno/consultarTurno?idTurno=b8zrvd
    //http://localhost:3000/api/turno/cancelar?idTurno=b8zrv
    var valid_ops_turno = {
        tomar: 'tomar',
        cancelar: 'cancelar',
        consultarTurno: 'consultarTurno'
    }

    this.add('role:api,path:turno', function(msg, respond) {
        var query = {};

        if (msg.idTurno)
            query.idTurno = msg.idTurno;

        if (msg.idClient)
            query.idTurno = msg.idCliente;

        if (msg.idSede)
            query.idSede = msg.idSede;

        query.cmd = valid_ops_turno[msg.operation];

        this.act('role:turno', query, respond)
    })


    this.add('init:api', function(msg, respond) {
        this.act('role:web', {
            use: {
                prefix: '/api',
                pin: 'role:api,path:*',
                map: {
                    calculate: {
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