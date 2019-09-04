<template>
  <button class="button" @click="handleClick">
    <hamburger-icon v-show="!open" class="icon"></hamburger-icon>
    <close-icon v-show="open" class="icon"></close-icon>
  </button>
</template>
<script>
import HamburgerIcon from "@/assets/svg/inline.hamburger.svg";
import CloseIcon from "@/assets/svg/inline.x.svg";

export default {
  components: {
    HamburgerIcon,
    CloseIcon
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit(this.open ? "close" : "open");
    }
  }
};
</script>
<style lang="scss" scoped>
$padding: 10px;
.button {
  position: relative;
  height: 100%;
  width: fit-content;

  outline: 0;

  @include for-size(tablet-landscape-up) {
    display: none;
  }
}

.icon {
  position: absolute;
  width: auto;
  height: 100%;
  top: 0;
  right: 0;

  padding: 10px;
}
</style>
