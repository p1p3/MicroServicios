var mathLogicFactory = require('./business/math.js')

function mathPlugin(options) {
	var mathLogic;
	
	//Operaciones
	this.add('role:math,cmd:sum', sumar)
	this.add('role:math,cmd:product', multiplicar)
	
	
	//Wrappers
	this.wrap('role:math', parseIntegers);


	//Inicialización
	this.add({ init: mathPlugin}, init)


	function sumar(msg, respond) {
		var result = mathLogic.sumar(msg.left , msg.right);
		var out = { answer: result }
		respond(null, out)
	}
	
	function multiplicar(msg, respond) {
		var result = mathLogic.multiplicar(msg.left , msg.right);
		var out = { answer: result }
		respond(null, out)
	}
	
	function init(msg, respond) {
		console.log("Iniciando microservicio...");
		mathLogic = options.mathLogic;
		respond();
		console.log("Se inició con éxito!");
	}

	function parseIntegers(msg, respond) {
		msg.left = Number(msg.left).valueOf()
		msg.right = Number(msg.right).valueOf()
		this.prior(msg, respond)
	}

}

require('seneca')()
  .use(mathPlugin, { mathLogic:new mathLogicFactory,test: "prueba"})
   .listen({ type: 'tcp',  port: 1223, host: 'localhost', })




