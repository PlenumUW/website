<template>
  <div class="about-view">
    <paper :color="color">
      <h1>This is an about page</h1>
    </paper>
  </div>
</template>

<script>
import View from "./View";

export default {
  name: "about",
  extends: View
};
</script>
