<template>
  <h1>{{ msg }}</h1>
  <button @click="increaseCounter()">counter is: {{ counter }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  <pre>{{data}}</pre>
</template>

<script>
import { useQuery } from 'villus';
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const store = useStore();
    const counter = computed(() => store.state.counter)
    const { data } = useQuery({
      query: `
        query { viewer { login }}
      `
    });
    function increaseCounter() {
      store.dispatch('increaseCounter',1)
    }
    return {
      data,
      counter,
      increaseCounter
    }
  }
}
</script>
