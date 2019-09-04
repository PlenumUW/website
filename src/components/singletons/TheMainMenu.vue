<template>
  <nav
    class="c-the-main-nav"
    :class="{
      'c-the-main-nav--open': open || menuHovered
    }"
  >
    <ul
      class="c-main-menu"
      :class="{
        'c-main-menu--hovered': menuHovered,
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
          <div
            class="c-main-menu__item-content"
            :class="{ 'c-main-menu__item-content--highlighted': false }"
          >
            <div class="c-main-menu__item-content__name">
              {{ name | capitalize }}
            </div>
          </div>
        </router-link>
      </li>
    </ul>

    <div
      class="c-the-main-nav__background"
      aria-hidden="true"
      :style="{ 'background-color': bgColor }"
    ></div>
  </nav>
</template>
<script>
import colors from "@/utils/colors";

export default {
  props: {
    open: {
      type: Boolean,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      menuHovered: false
    };
  },
  computed: {
    menuItems: function() {
      return this.$router.options.routes.filter(route => route.meta.menuItem);
    }
  },
  methods: {
    handleMenuItemClick(e) {
      this.resetMenu();
    },
    handleMainMenuHover(e) {
      this.menuHovered = e.type === "mouseenter";
    },
    getMenuItemColor(hue) {
      return colors.getMenuItemColor(hue);
    },
    // TODO: trigger this method when the logo is clicked while the menu is open?
    resetMenu() {
      this.setOpen(false);
      // TODO: since mobile 'hover' lingers after click, fix in order to close menu after menu item activation
      //    - currently the menu stays open because it is still being 'hovered'
      this.menuHovered = false;
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

  &--open {
    pointer-events: all;

    #{$base-class}__background {
      opacity: 1;

      transition: opacity 200ms ease-out;
    }
  }

  @include for-size(tablet-landscape-up) {
    width: unset;
    height: unset;
    left: calc(#{$lefter-width} / 2 - #{$menu-item-width--visual} / 2);

    pointer-events: all;
  }

  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;

    z-index: -1;

    transition: opacity 200ms ease-in;

    @include for-size(tablet-landscape-up) {
      display: none;
    }
  }
}

$menu-left-position: -2 * $outline-width;
$menu-width--mobile: calc(
  100% - 50px + #{$outline-width} - #{$menu-left-position}
); // 50px equals icon width
.c-main-menu {
  position: relative;
  width: $menu-width--mobile;
  max-width: 0;

  left: $menu-left-position;
  top: -1 * $outline-width;

  padding: $outline-width;

  overflow: hidden;

  font-family: Poppins;
  font-size: 30px;

  transition: max-width 200ms ease-in-out;

  &--expanded {
    max-width: $menu-width--mobile;
  }

  @include for-size(tablet-landscape-up) {
    left: -1 * $outline-width;
    width: $menu-item-width--expanded + $outline-width * 2;

    max-width: $menu-item-width--visual + 3px;

    transition-delay: 1000ms;

    &--expanded {
      max-width: $menu-item-width--expanded + $outline-width * 2;

      transition: max-width 200ms ease-in-out;
    }
  }

  &__item {
    height: $menu-item-height;
    width: 100%;
    margin-bottom: 13px;

    &:last-of-type {
      margin-bottom: 0;
    }

    @include for-size(tablet-landscape-up) {
      width: $menu-item-width--expanded;
    }

    &-link {
      width: 100%;
      height: 100%;
      white-space: nowrap;

      text-decoration: none;
    }

    &-content {
      height: 100%;

      &--highlighted {
        outline: $outline-width solid black;
      }

      &__name {
        position: relative;
        width: fit-content;
        height: 100%;
        right: 0;
        margin-right: 0;
        margin-left: auto;
        padding-right: 5px;

        line-height: $menu-item-height;
      }
    }
  }
}
</style>
