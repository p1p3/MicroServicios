var comConfigTurnos = {
      type: 'tcp',
      port: 1224,
      host: 'localhost',
      pin:'role:turno'
}

var comConfigFilas = {
      type: 'tcp',
      port: 1225,
      host: 'localhost',
      pin:'role:fila'
};

var seneca = require('seneca')()
      .use('entity')
      .use('api')
      .client(comConfigFilas)
      .client(comConfigTurnos)

var port = process.env.PORT || 3000

var app = require('express')()
      .use(require('body-parser').json())
      .use(seneca.export('web'))
      .listen(port)