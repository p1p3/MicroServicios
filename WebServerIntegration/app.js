
var seneca = require('seneca')()
      .use('entity')
      .use('api')
     // .client({ type: 'tcp', port: 1223, host: 'localhost', })
      .client({ type: 'tcp', port: 1224, host: 'localhost', })

var port = process.env.PORT || 3000

var app = require('express')()
      .use(require('body-parser').json())
      .use(seneca.export('web'))
      .listen(port)