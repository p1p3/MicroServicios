var filasClientFactory = function filas(seneca) {
    var client = require('seneca')().use('entity').client({ type: 'tcp', port: 1225, host: 'localhost', });
    return {
        obtenerFilaDisponible: function (idSede, fn) {
            client.act({ role: 'fila', cmd: 'filaDisponible', idSede: idSede }, fn)
        }
    }
}

module.exports = filasClientFactory;