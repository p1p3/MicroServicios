module.exports = function api(options) {

    //http://localhost:3000/api/calculate/sumar?left=2&right=3 
    //http://localhost:3000/api/calculate/multiplicar?left=2&right=3 
    var valid_ops_math = { sumar: 'sum', multiplicar: 'product' }

    //http://localhost:3000/api/turno/tomar?idCliente=asd
    //http://localhost:3000/api/turno/consultarTurno?idTurno=b8zrvd
    //http://localhost:3000/api/turno/cancelar?idTurno=b8zrv
    var valid_ops_turno = { tomar: 'tomar', cancelar: 'cancelar', consultarTurno: 'consultarTurno' }

    this.add('role:api,path:calculate', function (msg, respond) {
        this.act('role:math', {
            cmd: valid_ops_math[msg.operation],
            left: msg.left,
            right: msg.right,
        }, respond)
    })
    
    this.add('role:api,path:turno', function (msg, respond) {
        if (msg.idTurno) {
            this.act('role:turno', {
                cmd: valid_ops_turno[msg.operation],
                idTurno: msg.idTurno,
            }, respond)
        } else if (msg.idCliente) {
            this.act('role:turno', {
                cmd: valid_ops_turno[msg.operation],
                idCliente: msg.idCliente,
            }, respond)
        }
    })
    
    
    this.add('init:api', function (msg, respond) {
        this.act('role:web', {
            use: {
                prefix: '/api',
                pin: 'role:api,path:*',
                map: {
                    calculate: { GET: true, suffix: '/:operation' },
                    turno: { GET: true, suffix: '/:operation' }
                }
            }
        }, respond)
    })

}