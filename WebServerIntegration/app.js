
var seneca = require('seneca')()
      .use('api')
      .client({ type: 'tcp', port: 1223, host: 'localhost', })

var app = require('express')()
      .use(require('body-parser').json())
      .use(seneca.export('web'))
      .listen(3000)