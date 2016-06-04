var eventBrokerClientFactory = function eventBroker(_comConfig) {
    var client = require('seneca')().client({ type: 'tcp', port: 1220, host: 'localhost', });
    var comConfig = _comConfig;
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
        }
    }
}

module.exports = eventBrokerClientFactory;