var eventBrokerClientFactory = function eventBroker(_comConfig) {
    var client = require('seneca')().client({ type: 'tcp', port: 1220, host: 'localhost', });
    var comConfig = _comConfig;
    
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
        }, emitTurnoAsignadoEvent: function (turno) {

            var eventArgs = {
                turnoId: turno.id , filaId: turno.codigoFila
            }

            emitirEvento(1, eventArgs);
           
        }, emitirTurnoCanceladoEvent: function (turno) {
            
            var eventArgs = {
                turnoId: turno.id , filaId: turno.codigoFila
            }
            
            emitirEvento(2, eventArgs);
           
        }

    }
}

module.exports = eventBrokerClientFactory;