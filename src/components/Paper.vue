<template>
  <div
    class="c-paper"
    :class="shadowClass"
    :style="{ 'background-color': paperColor }"
  >
    <slot></slot>
  </div>
</template>

<script>
import colors from "@/utils/colors";

export default {
  name: "Paper",
  props: {
    color: {
      type: String,
      required: false,
      default: function() {
        return undefined;
      }
    },
    presetColor: {
      type: String,
      required: false,
      default: function() {
        return "yellow";
      }
    },
    shadow: {
      type: Number,
      required: false,
      validator: function(val) {
        const dps = [0, 1, 2, 3, 4, 6, 8, 9, 12, 16, 24];
        return dps.find(dp => dp === val);
      },
      default: function() {
        return 12;
      }
    }
  },
  computed: {
    paperColor: function() {
      return this.complementaryColor || this.presetRgbString;
    },
    shadowClass: function() {
      return ["shadow-" + this.shadow];
    },
    complementaryColor: function() {
      return this.color
        ? colors.getPaperColor(colors.getOppositeHueByRgbString(this.color))
        : undefined;
    },
    presetRgbString: function() {
      let color;

      switch (this.presetColor) {
        case "yellow":
          color = [247, 247, 233];
          break;
        default:
          color = [0, 0, 0];
      }

      return "rgb(" + color.join(",") + ")";
    }
  }
};
</script>

<style lang="scss">
.shadow-0 {
  @include box-shadow(0);
}
.shadow-1 {
  @include box-shadow(1);
}
.shadow-2 {
  @include box-shadow(2);
}
.shadow-3 {
  @include box-shadow(3);
}
.shadow-4 {
  @include box-shadow(4);
}
.shadow-6 {
  @include box-shadow(6);
}
.shadow-8 {
  @include box-shadow(8);
}
.shadow-9 {
  @include box-shadow(9);
}
.shadow-12 {
  @include box-shadow(12);
}
.shadow-16 {
  @include box-shadow(16);
}
.shadow-24 {
  @include box-shadow(24);
}
</style>
