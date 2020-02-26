// shallow mocks for the runtime-dependencies that redux layer expects for hunter
//com.sho.app.hunter
//goog.events.Event
//com.sho.app.hunter.Hunter.grandCentralDispatch
//com.sho.app.hunter.events.EventType

export default (() => {
  const fn = function(){}
  let Hunter = fn; 
  Hunter.grandCentralDispatch = {
    'dispatchEvent' : (fn)
  }
  Object.assign(Hunter.prototype, {
    'hide'   : fn,
    'show'   : fn,
    'launch' : fn,
    'reset'  : fn,
    'getCollectedImages' : (function(){
      return [{
        url:'http://www.sho.com/site/image-bin/images/323_1_127809/323_1_127809_01_100x150.jpg'
      }]
    })
  })
  let ImageSearch = fn
  global.com = {
    'sho' : {
      'app' : {
        'hunter' : {
          Hunter,
          'events' : {
            'EventType' : {}
          },
          'vo': {
            ImageSearch
          }
        }
      }
    },
  }
  global.goog = {
    'events' : {
      'Event'  : fn,
      'listen' : fn
    }
  }
})
