import { useEffect, useRef, useState } from 'react';
import { interpret, Machine } from 'xstate';

export default function useMachine(chart) {
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

export const FORM_STATE = {
  invalid: 'invalid',
  valid: 'valid',
  submitting: 'submitting',
  failure: 'failure',
};

export const FORM_EVENT = {
  validate: 'validate',
  invalidate: 'invalidate',
  submit: 'submit',
  fail: 'fail',
};

export const useFormStateMachine = () =>
  useMachine({
    id: 'formStateMachine',
    initial: FORM_STATE.invalid,
    states: {
      [FORM_STATE.invalid]: {
        on: {
          [FORM_EVENT.validate]: FORM_STATE.valid,
        },
      },
      [FORM_STATE.valid]: {
        on: {
          [FORM_EVENT.submit]: FORM_STATE.submitting,
          [FORM_EVENT.invalidate]: FORM_STATE.invalid,
        },
      },
      [FORM_STATE.submitting]: {
        on: {
          [FORM_EVENT.fail]: FORM_STATE.failure,
        },
      },
      [FORM_STATE.failure]: {},
    },
  });
