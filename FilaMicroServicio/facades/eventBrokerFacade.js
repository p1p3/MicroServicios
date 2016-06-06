var eventBrokerClientFactory = function eventBroker(comConfig) {
    var client = require('seneca')().use('entity').client({ type: 'tcp', port: 1220, host: 'localhost', });

      var emitirEvento = function (idEvento,eventArgs) { 
        client.act({ role: 'eventBroker', cmd: 'emitir', eventArgs: eventArgs, eventId: idEvento });
    }
    
    return {
        subscribeToEvent: function (eventId, responsePattern, fn) {
            var subscriber = {
                role: 'eventBroker',
                cmd: 'subscribe',
                eventId: eventId, 
                responsePattern: responsePattern,
                comConfig: comConfig
            }
            client.act(subscriber, fn)
        }, emitirSiguienteTurno: function (siguienteTurno,turnoFinalizado) {
            var eventArgs = {
               siguienteTurno : {turnoId: siguienteTurno.idTurno},
               turnoFinalizado : {turnoId: turnoFinalizado.idTurno}
            }
            emitirEvento(3, eventArgs);
        }
    }
}

module.exports = eventBrokerClientFactory;