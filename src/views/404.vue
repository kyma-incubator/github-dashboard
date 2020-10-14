<template>
  <h1>Page not found {{ randomNumber }}</h1>
</template>

<script>
export default {
  name: "404",
  data() {
    return {
      randomNumber: Math.random()
    };
  }
};
</script>
