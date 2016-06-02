module.exports = function api(options) {
    //http://localhost:3000/api/calculate/sumar?left=2&right=3 
    //http://localhost:3000/api/calculate/multiplicar?left=2&right=3 
    var valid_ops = { sumar: 'sum', multiplicar: 'product' }
    
    this.add('role:api,path:calculate', function (msg, respond) {
        this.act('role:math', {
            cmd: valid_ops[msg.operation],
            left: msg.left,
            right: msg.right,
        }, respond)
    })
    
    
    this.add('init:api', function (msg, respond) {
        this.act('role:web', {
            use: {
                prefix: '/api',
                pin: 'role:api,path:*',
                map: {
                    calculate: { GET: true, suffix: '/:operation' }
                }
            }
        }, respond)
    })

}