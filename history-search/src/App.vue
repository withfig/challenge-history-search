<template>
  <div id="app">
    <p>Hello there!</p>
    {{ debugInfo }}
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";


export default class App extends Vue {}
</script>

<style>
/* #app {
  position: fixed;
  bottom: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  font-size: 14px;
  margin-left: 0;
  font-style: italic;
  overflow: auto hidden;
  white-space: nowrap;
} */

html {
  --main-bg-color: rgb(48, 48, 48);
  --main-text-color: rgb(180, 180, 180);
  --description-text-color: rgb(180, 180, 180);
  --description-border-color: rgb(65, 65, 65);
  --selected-bg-color: rgb(30, 90, 199);
  --selected-text-color: rgb(253, 253, 253);
  --matching-bg-color: rgb(95, 89, 56);
}

html {
  overflow: hidden;
  height: 100%;
  background-color: rgb(153, 44, 44);
}

body {
  height: 100%;
  overflow: auto;
  margin: 0;
  -webkit-user-select: none !important;
  background-color: var(--main-bg-color);
}

.text {
  font-family: "Monaco";
  font-size: 0.8em;
  color: var(--main-text-color);
}
</style>
