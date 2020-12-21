import { computed } from 'vue';
import createStore from '@korijn/vue-store';

const initialState = {
  todos: [],
};

let newId = 0;
const mutations = {
  addTodo(state, { text }) {
    state.todos.push({ text, status: 'open', id: newId });
    newId += 1;
  },
  deleteTodo(state, { id }) {
    const idx = state.todos.findIndex((todo) => todo.id === id);
    if (idx !== -1) {
      state.todos.splice(idx, 1);
    }
  },
  toggleTodo(state, { id }) {
    const idx = state.todos.findIndex((todo) => todo.id === id);
    if (idx !== -1) {
      const todo = state.todos[idx];
      todo.status = (todo.status === 'open') ? 'done' : 'open';
    }
  },
  toggleAllTodos(state) {
    let newState = 'open';
    for (let i = 0; i < state.todos.length; i += 1) {
      if (state.todos[i].status === 'open') {
        newState = 'done';
        break;
      }
    }
    for (let i = 0; i < state.todos.length; i += 1) {
      state.todos[i].status = newState;
    }
  },
  clearCompletedTodos(state) {
    const completed = state.todos.filter((todo) => todo.status === 'done');
    for (let i = 0; i < completed.length; i += 1) {
      const idx = state.todos.indexOf(completed[i]);
      state.todos.splice(idx, 1);
    }
  },
};

const store = createStore(initialState, mutations);

const activeItems = computed(() => store.state.todos.filter((todo) => todo.status !== 'done'));
const completedItems = computed(() => store.state.todos.filter((todo) => todo.status === 'done'));

export default {
  ...store,
  computed: {
    activeItems,
    completedItems,
  },
};
