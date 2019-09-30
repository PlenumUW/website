<template>
  <div class="c-paper paper" :class="dynamicClasses" :style="{ 'background-color': paperColor }">
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
      default: function () {
        return undefined;
      }
    },
    presetColor: {
      type: String,
      required: false,
      default: function () {
        return "yellow";
      }
    },
    shadow: {
      type: Number,
      required: false,
      validator: function (val) {
        const shadowLevels = 24;
        const testVal = val / shadowLevels;
        const isInRange = testVal >= 0 && testVal <= shadowLevels;
        const isInteger = Math.floor(val) === val;

        return isInRange && isInteger;
      },
      default: function () {
        return 12;
      }
    },
    type: {
      type: String,
      required: false,
      validator: function (val) {
        return ["toc", "toc-entry", "essay", "default"].some(
          type => val === type
        );
      },
      default: function () {
        return "default";
      }
    }
  },
  computed: {
    dynamicClasses: function () {
      return [this.shadowClass, this.paperTypeClass];
    },
    paperColor: function () {
      return this.complementaryColor || "transparent";
    },
    paperTypeClass: function () {
      return "paper--" + this.type;
    },
    shadowClass: function () {
      return "shadow-" + this.shadow;
    },
    complementaryColor: function () {
      return this.color
        ? colors.getPaperColor(colors.getOppositeHueByRgbString(this.color))
        : undefined;
    },
    presetRgbString: function () {
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
