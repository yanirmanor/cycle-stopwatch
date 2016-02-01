import {div, button, h2, hr, makeDOMDriver} from '@cycle/dom';
import Cycle from '@cycle/core';
import Rx from 'rx';

function main(sources) {
  
    const inc = state=> Object.assign(state, {
      isRunning:true, tick: state.tick + 1
    });
  
    const zero = state=> Object.assign(state, {
      isRunning:false, tick:0
    });
  
    const stop = state=> Object.assign(state, {
      isRunning:false
    });
  
  const start  = sources.DOM.select('.start').events('click');
  
  const pause  = sources.DOM.select('.pause ').events('click');
  
  const reset   = sources.DOM.select('.stop').events('click');
  
  const timer = Rx.Observable.interval(1000);
  
  const stopAction = Rx.Observable.merge(pause,reset);  
  
  const startAction = start.flatMapLatest( () => {
    
    return Rx.Observable
      .merge( 
        timer.map( ()=> inc ),
        pause.map( ()=> stop ),
        reset.map( ()=> zero)
      )
      .takeUntil(stopAction);                         
    
  }).scan((state, op) => {
        return op(state);
      }, 
      {
        isRunning:false,
        tick:0
      })
  .startWith({
    isRunning:false,
    tick:0
  });
 
  return {
    DOM: startAction.map( state =>
      div([
        state.isRunning ? null : button('.start','start') ,
        !state.isRunning ? div([
          button('.stop','stop'),
          button('.pause','pause'),
        ]) : null,
        hr(),
        h2(String(state.tick))
      ])
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});