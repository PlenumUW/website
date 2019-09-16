<template>
  <nav class="c-the-main-nav">
    <ul
      class="c-main-menu"
      :class="{
        'c-main-menu--expanded': menuHovered || open
      }"
      @mouseenter="handleMainMenuHover"
      @mouseleave="handleMainMenuHover"
    >
      <li
        v-for="{ path, name, meta } in menuItems"
        :key="`c-main-menu__item--${name}`"
        class="c-main-menu__item"
        :style="{ 'background-color': getMenuItemColor(meta.hue) }"
      >
        <router-link
          :to="path"
          class="c-main-menu__item-link"
          @click.native="handleMenuItemClick"
        >
          <div class="c-main-menu__item-content">
            <div class="c-main-menu__item-content__name">{{ name }}</div>
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
import colors from "@/utils/colors";

export default {
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      menuHovered: false
    };
  },
  computed: {
    menuItems: function () {
      return this.$router.options.routes.filter(route => route.meta.menuItem);
    }
  },
  methods: {
    handleMenuItemClick() {
      this.resetMenu();
    },
    handleMainMenuHover(e) {
      this.menuHovered = e.type === "mouseenter";
    },
    getMenuItemColor(hue) {
      return colors.getMenuItemColor(hue);
    },
    resetMenu() {
      document.activeElement.blur(); // Link activation retains focus, which would keep menu open otherwise
      this.menuHovered = false; // Ensures the menu closes on mobile/ tablet
      this.setOpen(false);
    },
    setOpen(val) {
      this.$emit("update:open", val);
    }
  }
};
</script>
<style lang="scss" scoped>
$outline-width: 3px;

$menu-item-width--expanded--visual: 215px;
$menu-item-width--visual: 45px;

$menu-item-width--expanded: 215px + $outline-width * 2;
$menu-item-width: 45px + $outline-width * 2;
$menu-item-height: $menu-item-width--visual;

$lefter-width: $g-lefter-width;

$base-class: ".c-the-main-nav";

.c-the-main-nav {
  width: 100%;
  height: 100%;
  left: 0;

  display: flex;
  flex-direction: column;

  pointer-events: none;

  transition: 200ms ease-in-out;

  @include for-size(tablet-landscape-up) {
    width: unset;
    height: unset;
    left: calc(#{$lefter-width} / 2 - #{$menu-item-width--visual} / 2);
  }
}

$menu-left-position: -2 * $outline-width;
$menu-width--mobile: calc(
  100% - 50px + #{$outline-width} - #{$menu-left-position}
); // 50px equals icon width
.c-main-menu {
  width: $menu-width--mobile;
  max-width: 0;

  left: $menu-left-position;
  top: -1 * $outline-width;

  position: relative;
  padding: $outline-width;
  overflow: hidden;

  font-family: $font-sans;
  font-size: 30px;

  pointer-events: all;

  transition: max-width 200ms ease-in-out;

  &--expanded {
    max-width: $menu-width--mobile;
  }

  @include for-size(tablet-landscape-up) {
    left: -1 * $outline-width;
    width: $menu-item-width--expanded + $outline-width * 2;

    max-width: $menu-item-width--visual + 3px;

    transition-delay: 1000ms;

    &--expanded,
    &:focus-within {
      max-width: $menu-item-width--expanded + $outline-width * 2;

      transition: max-width 200ms ease-in-out;
    }
  }

  &__item {
    height: $menu-item-height;
    width: 100%;
    margin-bottom: 13px;

    // @include mdElevation(2, $inset: true);
    // @include mdElevationTransition(2);

    // &:hover {
    //   @include mdElevation(6, $inset: true);
    // }

    &:last-of-type {
      margin-bottom: 0;
    }

    @include for-size(tablet-landscape-up) {
      width: $menu-item-width--expanded;
    }

    &-link {
      display: block;
      width: 100%;
      height: 100%;
      white-space: nowrap;

      text-decoration: none;

      &:focus {
        @include focus(0);
      }
    }

    &-content {
      height: 100%;

      &__name {
        position: relative;
        width: fit-content;
        height: 100%;
        right: 0;
        margin-right: 0;
        margin-left: auto;
        padding-right: 5px;

        font-weight: 600;
        line-height: $menu-item-height;
        text-transform: capitalize;
      }
    }
  }
}
</style>
