import {div, button, makeDOMDriver} from '@cycle/dom';
import Cycle from '@cycle/core';
import Rx from 'rx';

function intent(interactions) {
  
  const start$ = interactions.select('.start').events('click');
  const pause$ = interactions.select('.pause ').events('click');
  const reset$  = interactions.select('.stop ').events('click');
  
  return {
      start : start$,
      pause : pause$,
      reset : reset$,
  };
}

function model(actions){
  
  const inc = state=> Object.assign(state, { isRunning:true, tick: state.tick + 1 });
  const zero = state=> Object.assign(state,{ isRunning:false, tick:0 });
  const stop = state=> Object.assign(state,{ isRunning:false });
  
  const initialState = { isRunning:false, tick:0};
  
  const timer = Rx.Observable.interval(1000);
  
  const stopAction = Rx.Observable.merge(actions.pause, actions.reset); 
  
  const startAction = actions.start.flatMapLatest(()=> {
    return Rx.Observable
      .merge( 
        timer.map(()=> inc),
        actions.pause.map(()=> stop),
        actions.reset.map(()=> zero)
      )
      .takeUntil(stopAction);                         
  })
  .scan((state, op) => op(state), initialState)
  .startWith(initialState);
  
  return startAction;
}

function view(state) {
  return {
    DOM: state.map( state =>
      div('.container',[
        div('.number',String(state.tick)),      
        state.isRunning ? null : button('.btn .start','start') ,
        state.isRunning ? div([
          button('.btn .stop','stop'),
          button('.btn .pause','pause'),
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