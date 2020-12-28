<template>
  <div class="app">
    <h1>todos</h1>
    <div class="column">
      <div class="row justify-center">
        <button :disabled="!canUndo" @click="undo">Undo</button>
        <button :disabled="!canRedo" @click="redo">Redo</button>
      </div>
      <div class="row">
        <div>
          <button v-if="state.todos.length > 0" @click="toggleAllTodos">
            {{ filteredTodos.length > 0 && !activeItems.length ? "☑" : "☐" }}
          </button>
        </div>
        <input
          class="grow"
          placeholder="What needs to be done?"
          v-model="inputTodo"
          @keyup.enter="addTodo"
        />
      </div>
      <div class="row" v-for="todo in filteredTodos" :key="todo.id">
        <div>
          <button @click="toggleTodo(todo.id)">
            {{ todo.status === "done" ? "☑" : "☐" }}
          </button>
        </div>
        <div
          class="grow text-left"
          :class="{
            strikethrough: todo.status === 'done',
          }"
        >{{ todo.text }}</div>
        <div>
          <button @click="deleteTodo(todo.id)">
            X
          </button>
        </div>
      </div>
      <div class="row-lg" v-if="state.todos.length > 0">
        <div class="third text-left-lg">
          <template v-if="activeItems.length > 0">
            {{ activeItems.length }} items left
          </template>
        </div>
        <div class="third justify-between row-lg">
          <div>
            <button
              @click="setFilter(undefined)"
              :class="{active: todoFilter === undefined}"
            >
              All
            </button>
          </div>
          <div>
            <button
              @click="setFilter('open')"
              :class="{active: todoFilter === 'open'}"
            >
              Active
            </button>
          </div>
          <div>
            <button
              @click="setFilter('done')"
              :class="{active: todoFilter === 'done'}"
            >
              Completed
            </button>
          </div>
        </div>
        <div class="third text-right-lg">
          <button
            class="text-right-lg"
            v-if="completedItems.length > 0"
            @click="clearCompletedTodos"
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import store from './store';

export default {
  name: 'App',
  setup() {
    const inputTodo = ref('');
    const todoFilter = ref();
    const filteredTodos = computed(() => (
      todoFilter.value
        ? store.state.todos.filter((todo) => todo.status === todoFilter.value)
        : store.state.todos
    ));
    return {
      todoFilter,
      inputTodo,
      filteredTodos,
      state: store.state,
      undo: store.undo,
      canUndo: store.canUndo,
      redo: store.redo,
      canRedo: store.canRedo,
      ...store.computed,
      addTodo() {
        store.addTodo({ text: inputTodo.value });
        inputTodo.value = '';
      },
      deleteTodo(id) {
        store.deleteTodo({ id });
      },
      toggleTodo(id) {
        store.toggleTodo({ id });
      },
      toggleAllTodos: store.toggleAllTodos,
      clearCompletedTodos: store.clearCompletedTodos,
      setFilter(value) {
        todoFilter.value = value;
      },
    };
  },
};
</script>

<style>
* {
  font-size: 20pt;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #707070;
}

h1 {
  font-size: 1.8em;
}

#app {
  text-align: center;
}

.strikethrough {
  text-decoration: line-through;
}

.column {
  display: flex;
  flex-direction: column;
}
.column > .row {
  margin: 3px 0;
}
.row {
  display: flex;
  flex-direction: row;
}
.row > input {
  display: flex;
  min-width: 10px;
}
@media (min-width: 840px) {
  .row-lg {
    display: flex;
    flex-direction: row;
  }
  .third {
    width: 33.33%;
  }
  .text-left-lg {
    text-align: left;
  }
  .text-right-lg {
    text-align: right;
  }
  #app {
    margin: 60px;
  }
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.grow {
  flex: 1 1 auto;
}

button {
  background: transparent;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  outline: none;
}

button:hover:not(:disabled) {
  color: #303030;
}
button.active {
  color: #303030;
  border: 1px solid #666;
}

button:disabled {
  cursor: auto;
  opacity: 0.5;
}
</style>
