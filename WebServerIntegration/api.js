module.exports = function api(options) {
    //http://localhost:3000/api/calculate/sumar?left=2&right=3 
    //http://localhost:3000/api/calculate/multiplicar?left=2&right=3 
    var valid_ops_math = { sumar: 'sum', multiplicar: 'product' }
    //http://localhost:3000/api/turno/cancelar?idTurno=2 
    var valid_ops_turno = { tomar: 'tomar', cancelar: 'cancelar', consultarTurno: 'consultarTurno' }

    this.add('role:api,path:calculate', function (msg, respond) {
        this.act('role:math', {
            cmd: valid_ops_math[msg.operation],
            left: msg.left,
            right: msg.right,
        }, respond)
    })
    
    this.add('role:api,path:turno', function (msg, respond) {
        this.act('role:turno', {
            cmd: valid_ops_turno[msg.operation],
            idTurno: msg.idTurno,
        }, respond)
    })
    
    //this.add('role:api,path:turno', function (msg, respond) {
    //    this.act('role:turno,param:idCliente', {
    //        cmd: valid_ops_turno[msg.operation],
    //        idCliente: msg.idCliente,
    //    }, respond)
    //})
    
    /*
     * 
     *   this.add('role:turno,cmd:tomar,param:idCliente', tomarTurno)
    this.add('role:turno,cmd:cancelar,param:idTurno', cancelarTurno)
    this.add('role:turno,cmd:consultarPuesto,param:idTurno', consultarPuesto)
     * */
      
    
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