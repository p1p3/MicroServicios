function eventPlugin(options) {
    var seneca;

    var events = [{
        id: 1,
        nombre: 'turnoAsignado',
        subcribers: []
    }, {
        id: 2,
        nombre: 'turnoCancelado',
        subcribers: []
    }, {
        id: 3,
        nombre: 'siguienteTurno',
        subcribers: []
    }]

    //Operaciones
    this.add('role:eventBroker,cmd:subscribe', subscribe)
    this.add('role:eventBroker,cmd:emitir', emitirEvento)


    //Inicialización
    this.add({
        init: eventPlugin
    }, init)


    //implementaciones
    function subscribe(msg, respond) {

        // msg.eventId, msg.responsePattern, msg.comConfig
        var registroOk = false;
        var event = findEventById(msg.eventId);


        if (event.length == 1) {
            event = event[0];
            var alreadySubscribed = patternSubscribed(event, msg.responsePattern).length > 0;
            if (!alreadySubscribed) {
                event.subcribers.push({
                    pattern: msg.responsePattern,
                    comConfig: msg.comConfig
                })
                registroOk = true;
            }
        }


        var out = {
            answer: registroOk
        }
        respond(null, out)
    }

    function emitirEvento(msg, respond) {
        var evento = findEventById(msg.eventId);
        var eventArgs = msg.eventArgs;
        var result;


        console.log("inicio emision evento", evento);
        console.log("Datos", eventArgs);

        if (evento.length > 0) {
            evento = evento[0];
            evento.subcribers.forEach(function(subscriber) {
                var msgPattern = subscriber.pattern;
                msgPattern.eventArgs = eventArgs;

                console.log("datos cliente ", subscriber.comConfig);

                if (!subscriber.client) {
                    subscriber.client = createClient(subscriber.comConfig);
                }

                console.log("datos emision ", msgPattern);
                subscriber.client.act(msgPattern);
            });

            result = "El evento fue transmitido con éxito"
        }
        else {
            result = "El evento no se encuentra registrado";
        }

        var msgResponse = {
            ok: true,
            result: result
        }

        respond(null, msgResponse);

    }


    function init(msg, respond) {
        console.log("Iniciando microservicio eventos...");
        seneca = options.seneca;
        respond();
        console.log("El microservicio de eventos se inició con éxito!");
    }

    function findEventById(id) {
        return events.filter(function(event) {
            return event.id == id;
        });
    }

    function patternSubscribed(event, pattern) {
        return event.subcribers.filter(function(subscriber) {
            return subscriber.pattern == pattern;
        })
    }

    function createClient(comConfig) {
        return require('seneca')().use('entity').client(comConfig);
    }
}

var seneca = require('seneca')().use('entity');


seneca
    .use(eventPlugin, {
        seneca: seneca
    })
    .listen({
        type: 'tcp',
        port: 1220,
        host: 'localhost',
    })

