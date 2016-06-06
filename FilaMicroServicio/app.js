var filaLogicFactory = require('./services/fila.js');
var filasRepositoryFactory = require('./data/filaRepository.js');
var eventBrokerFactory = require('./facades/eventBrokerFacade.js');

var comConfig = {
    type: 'tcp',
    port: 1225,
    host: 'localhost',
};

var correrPruebas = false;
var crearFilaPruebas = true;


function filaPlugin(options) {
    var filasLogic;
    var eventClient;


    //Operaciones
    this.add('role:fila,cmd:filaDisponible', filaDisponible)
    this.add('role:fila,cmd:abrirFila', abrirFila)
    this.add('role:fila,cmd:siguienteTurno', siguienteTurno)


    //Eventos
    var tomaTurnoPattern = {
        role: 'fila',
        cmd: 'tomaTurnoEvento'
    };
    
    this.add(tomaTurnoPattern, tomaTurnoEvento)
    var cancelaTurnoPattern = {
        role: 'fila',
        cmd: 'cancelaTurnoEvento'
    };
    this.add(cancelaTurnoPattern, cancelaTurnoEvento)

    //Inicialización
    this.add({
        init: filaPlugin
    }, init)

    function filaDisponible(msg, respond) {
        var idSede = msg.idSede;
        filasLogic.filaDisponible(idSede, function(err, fila) {
            respond(err, fila);
        });
    }

    function abrirFila(msg, respond) {
        var caja = {
            idSede: msg.idSede,
            idCaja: msg.idCaja
        };

        filasLogic.abrirFila(caja, function(err, fila) {
            var ok = !err
            var msg = {
                ok: ok,
                result: fila
            }
            respond(err, msg);
        });
    }

    function siguienteTurno(msg, respond) {
        var filaId = msg.filaId;
        filasLogic.siguienteTurno(filaId, function(err, operationDone) {
            var noError = !err
            var msg = {
                ok: noError,
                result: operationDone
            }
            respond(err, msg);
        });
    }

    function tomaTurnoEvento(msg, respond) {
        console.log("evento recibido tomaTurno", msg.eventArgs);

        var eventArgs = msg.eventArgs;
        var idFila = eventArgs.filaId;
        var idTurno = eventArgs.turnoId;

        filasLogic.tomaTurnoEvento(idFila, idTurno, function(err, operationDone) {

            var noError = !err
            var msg = {
                ok: noError,
                result: operationDone
            }
            respond(null, msg);
        });
    }

    function cancelaTurnoEvento(msg, respond) {
        console.log("evento recibido cancelaTurno", msg.eventArgs);

        var eventArgs = msg.eventArgs;
        var idFila = eventArgs.filaId;
        var idTurno = eventArgs.turnoId;

        filasLogic.cancelaTurnoEvento(idFila, idTurno, function(err, operationDone) {

            var noError = !err
            var msg = {
                ok: noError,
                result: operationDone
            }
            respond(null, msg);
        });

    }

    function init(msg, respond) {
        console.log("Iniciando microservicio filas...");

        var dbFila = options.dbFila;
        eventClient = options.eventBrokerClient;

        filasLogic = new filaLogicFactory(dbFila, eventClient);

        eventClient.subscribeToEvent(1, tomaTurnoPattern, console.log("Subscibiendo a evento de tomaTurno"))
        eventClient.subscribeToEvent(2, cancelaTurnoPattern, console.log("Subscibiendo a evento de cancelaTurno"))

        respond();
        console.log("El microservicio de filas se inició con éxito!");
    }
}


var seneca = require('seneca')().use('entity')

seneca
    .use(filaPlugin, {
        dbFila: new filasRepositoryFactory(seneca),
        eventBrokerClient: new eventBrokerFactory(comConfig)
    })
    .listen(comConfig)


//Llenado de base de datos    
if (crearFilaPruebas || correrPruebas) {
    seneca.act({
        role: 'fila',
        cmd: 'abrirFila',
        idSede: 'sedePrueba',
        idCaja: 'cajaPruebas'
    }, function(err, response) {
        var filaCreada = response.result;
        console.log("Se creo la fila con exito ", filaCreada);

        if (correrPruebas) {
            console.log("------------------------------------ Pruebas ---------------------------------------------------------------- ");

           
            var idSede = filaCreada.caja.idSede;
            var idFila = filaCreada.id;

            console.log("---- Prueba operacion filaDisponible ---- ");

            seneca.act({
                role: 'fila',
                cmd: 'filaDisponible',
                idSede: idSede
            }, function(err, response) {
                logPruebas(err, response);

                console.log("---- Prueba operacion TomaTurnoEvent ---- ");

                seneca.act({
                    role: 'fila',
                    cmd: 'tomaTurnoEvento',
                    eventArgs: {
                        filaId: idFila,
                        turnoId: 'primerTurnoPrueba'
                    }
                }, function(err, response) {
                    logPruebas(err, response);

                    console.log("---- Prueba operacion TomaTurnoEvent DOS ---- ");

                    seneca.act({
                        role: 'fila',
                        cmd: 'tomaTurnoEvento',
                        eventArgs: {
                            filaId: idFila,
                            turnoId: 'SegundoTurnoPrueba'
                        }
                    }, function(err, response) {
                        logPruebas(err, response);

                        console.log("---- Prueba operacion cancelaTurnoEvento ---- ");
                        seneca.act({
                            role: 'fila',
                            cmd: 'cancelaTurnoEvento',
                            eventArgs: {
                                filaId: idFila,
                                turnoId: 'primerTurnoPrueba'
                            }
                        }, function(err, response) {
                            logPruebas(err, response);
                        });

                    });

                })
            })

        }

    })

    var logPruebas = function(err, resultado) {
        if (err) {
            console.log("Sucedio un error ", err);
        }
        else {
            console.log("La prueba se corrio con exito ", resultado);
        }
    }
}
