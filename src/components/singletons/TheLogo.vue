<template>
  <div class="the-logo">
    <router-link to="/" class="the-logo__link" @click.native="handleClick">
      <logo
        class="icon"
        :class="{
          'icon--straight': hovered
        }"
        :style="{ width: width ? `${width}px` : null }"
        @mouseover="handleIconHover"
        @mouseout="handleIconHover"
      ></logo>
    </router-link>
  </div>
</template>

<script>
import Logo from "@/assets/svg/inline.logo.svg";

export default {
  components: { Logo },
  props: {
    width: {
      type: Number,
      required: false,
      default: function() {
        return undefined;
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
    },
    handleClick() {
      this.$emit("activate");
    }
  }
};
</script>

<style lang="scss" scoped>
$padding: 10px;

.the-logo {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__link {
    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    &:focus {
      @include focus();
    }
  }
}

.icon {
  position: relative;
  height: 100%;
  width: auto;

  padding: $padding;

  bottom: 0;

  margin: auto;
  transform: rotate(0);

  pointer-events: all;

  transition: transform 200ms ease-in;

  &--straight {
    transform: rotate(22deg);
    transition: transform 200ms ease-out;
  }
}
</style>
