<template>
  <div class="the-logo">
    <router-link to="/">
      <logo
        class="icon"
        :class="{
          'icon--straight': hovered,
          'icon--focused': focused
        }"
        :width="`${width + padding}px`"
        :height="`${height + padding}px`"
        :style="{ padding: padding }"
        @mouseover="handleIconHover"
        @mouseout="handleIconHover"
      ></logo>
    </router-link>
  </div>
</template>

<script>
import Logo from "@/assets/svg/inline.logo.svg";
// :viewBox="`0 0 ${width} ${height}`"
export default {
  components: { Logo },
  props: {
    width: {
      type: Number,
      required: false,
      default: function() {
        return 50;
      }
    }
  },
  data: function() {
    return {
      hovered: false,
      focused: false,
      padding: 10
    };
  },
  computed: {
    height: function() {
      return this.width;
    }
  },
  methods: {
    handleIconHover(e) {
      this.hovered = e.type === "mouseover";
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  position: absolute;
  left: 50%;
  bottom: 0;

  margin: auto;
  transform: translateX(-50%) rotate(0);

  pointer-events: all;

  transition: transform 200ms ease-in;

  &--straight {
    transform: translateX(-50%) rotate(22deg);
    transition: transform 200ms ease-out;
  }

  &--focused {
    outline: 3px solid black;
  }
}
</style>
