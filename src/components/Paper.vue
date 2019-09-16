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
        const shadowLevels = 24;
        const testVal = val / shadowLevels;
        const isInRange = testVal >= 0 && testVal <= shadowLevels;
        const isInteger = Math.floor(val) === val;

        return isInRange && isInteger;
      },
      default: function() {
        return 12;
      }
    }
  },
  computed: {
    paperColor: function() {
      return this.complementaryColor || "transparent";
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
@for $i from 0 through 24 {
  $hoverLevel: $i - 6;
  @if $hoverLevel < 0 {
    $hoverLevel: 2;
  }
  @if $hoverLevel > $i {
    $hoverLevel: 0;
  }

  .shadow-#{$i} {
    @include mdElevation($i);
    @include mdElevationTransition(4);

    &:hover {
      @include mdElevation($hoverLevel);
    }
  }
}
</style>
