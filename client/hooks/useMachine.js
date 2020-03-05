import { useEffect, useRef, useState } from 'react';
import { interpret, Machine } from 'xstate';

export default function(chart) {
  const [initialChart] = useState(chart);

  if (JSON.stringify(chart) !== JSON.stringify(initialChart)) {
    console.warn(
      'Chart given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n' +
        'Please make sure that you pass the same chart as argument each time.'
    );
  }

  const service = useSingleton(() => interpret(Machine(chart)).start());

  const [state, setState] = useState(service.state);

  useEffect(() => {
    service
      .onTransition(currentState => {
        if (currentState.changed) {
          setState(currentState);
        }
      })
      .start(state);

    return () => service.stop();
  });

  return [state, service.send];
}

function useSingleton(fn) {
  const ref = useRef();

  if (!ref.current) {
    ref.current = { v: fn() };
  }

  return ref.current.v;
}
