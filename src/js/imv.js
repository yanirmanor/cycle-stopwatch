import {div, button, h2, makeDOMDriver} from '@cycle/dom';
import Cycle from '@cycle/core';
import Rx from 'rx';

const initialState = { isRunning:false, tick:0, laps:[]};

function intent(interactions) {
  
  const start$ = interactions.select('.start').events('click');
  const pause$ = interactions.select('.pause ').events('click');
  const reset$  = interactions.select('.stop ').events('click');
  const lap$   = interactions.select('.lap').events('click');
  
  return {
      start : start$,
      pause : pause$,
      reset : reset$,
      lap   : lap$
  };
}

function model(actions){
  
  const inc  = state=> Object.assign(state,{ isRunning:true, tick: state.tick + 1 });
  const zero = state=> Object.assign(state,{ isRunning:false, tick:0, laps:[] });
  const stop = state=> Object.assign(state,{ isRunning:false });
  const laps = state=> Object.assign(state,{ laps: state.laps.concat(state.tick) });
  
  const timer$ = Rx.Observable.interval(1000);
  
  const stopAction$ = Rx.Observable.merge(actions.pause, actions.reset); 
  
  const startAction$ = actions.start.flatMapLatest(()=> {
    return Rx.Observable
      .merge( 
        timer$.map(()=> inc),
        actions.pause.map(()=> stop),
        actions.reset.map(()=> zero),
        actions.lap.map(()=> laps)
      )
      .takeUntil(stopAction$);                         
  })
  .scan((state, op) => op(state), initialState);
  
  return startAction$;
}

function view(state) {
  return {
    DOM: state
    .startWith(initialState)
    .map( state =>
      div('.container',[
        div('.number',String(state.tick)),      
        state.isRunning ? null : button('.btn .start','start') ,
        state.isRunning ? div([
          button('.btn .stop','stop'),
          button('.btn .pause','pause'),
          button('.btn .lap','lap'),
          h2('laps:'),
          div('.lap-container',[
            state.laps.map((lap)=> div('.lap-info',String(lap)))
          ])
        ]) : null,
      ])
    )
  };
}

function main({DOM}) {
  return view(model(intent(DOM)));
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});