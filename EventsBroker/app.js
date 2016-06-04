var filaEvents = null;

function eventPlugin(options) {
    var seneca;

    var events = [{ id: 1, port : 123, host: 'localhost',nombre: 'turnoAsignado', subcribers: [], client: null },
        { id: 2, port : 123, host: 'localhost', nombre: 'turnoCancelado' , subcribers: [] , client: null }]
    
    //Operaciones
    this.add('role:event,cmd:subscribe', subscribe)
    this.add('role:eventBroker,cmd:emitir', emitirEvento)
    
    
    //Inicialización
    this.add({ init: eventPlugin }, init)
    
    function  subscribe(msg, respond) {
       
        // msg.eventId, msg.responsePattern
        var registroOk = false;
        var event = findEventById(msg.eventId);
        
        if (event) {
            var alreadySubscribed = patternSubscribed(event, pattern);
            if (!alreadySubscribed) {
                var client = seneca.client({ type: 'tcp', port: event.port, host: event.host, });
                event.client = client;
                event.subcribers.push({ pattern: msg.responsePattern })
                registroOk = true;
            }
        }
        
        var out = { answer: registroOk }
        respond(null, out)
    }
    
    function emitirEvento(msg, respond) {
        var evento = findEventById(msg.eventId);
        var eventArgs = msg.eventArgs;
        var result;

        if (evento) {
            events.subcribers.forEach(function (subscriber) {
                subscriber.client.act(pattern, eventArgs);
            });
        } else {
            result = "El evento no se encuentra registrado";
        }
    }
    
    
    function init(msg, respond) {
        console.log("Iniciando microservicio eventos...");
        seneca = options.seneca;
        respond();
        console.log("El microservicio de eventos se inició con éxito!");
    }
    
    function findEventById(id) {
        return events.filter(function (event) {
            return event.id == msg.eventId;
        });
    }
    
    function patternSubscribed(event, pattern) {
        return event.subcribers.filter(function (subscriber) {
            return subscriber.pattern == pattern;
        })
    }
}

var seneca = require('seneca')().use('entity');

seneca
.use(filaPlugin, { seneca: seneca })
.listen({ type: 'tcp', port: 1220, host: 'localhost', })