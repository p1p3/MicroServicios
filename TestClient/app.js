//require('seneca')()
//.client({ port: 1223, host: 'localhost', type: 'tcp' })
//  .act('role:math,cmd:sum,left:1,right:2', console.log)

require('seneca')()

  // a local pattern
  .add('say:hello', function (msg, respond) { respond(null, { text: "Hi!" }) })

  // send any role:math patterns out over the network
  // IMPORTANT: must match listening service
  .client({ type: 'tcp', port: 1223, host: 'localhost',  })

  // executed remotely
  .act('role:math,cmd:sum,left:1,right:2', console.log)

  // executed locally
  .act('say:hello', console.log)
  
