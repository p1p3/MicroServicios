
var seneca = require('seneca')()
      .use('seneca-entity')
      .use('api')
     // .client({ type: 'tcp', port: 1223, host: 'localhost', })
      .client({ type: 'tcp', port: 1224, host: 'localhost', })

var app = require('express')()
      .use(require('body-parser').json())
      .use(seneca.export('web'))
      .listen(3000)