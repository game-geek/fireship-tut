import React, { useReducer } from "react";




enum types { ADD, REMOVE } // converted into numbers 0 - ...
type Actions =
  | { type: types.ADD; text: string }
  | {
      type: types.REMOVE;
      idx: number;
    };

interface Todo {
  text: string;
  complete: boolean;
}

type State = Todo[]; // array of objects

const TodoReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case types.ADD:
      return [...state, { text: action.text, complete: false }];
    case types.REMOVE:
      return state.filter((_, i) => action.idx !== i);
    default:
      return state;
  }
};

export const ReducerExample: React.FC = () => {
  const [todos, dispatch] = useReducer(TodoReducer, []);

  return (
    <div>
      {JSON.stringify(todos)}
      <button
        onClick={() => {
          dispatch({ type: types.ADD, text: "..." });
        }}
      >
        +
      </button>
    </div>
  );
};