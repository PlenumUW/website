<template>
  <nav class="c-the-main-nav">
    <ul
      class="c-main-menu"
      :class="{ 'c-main-menu--expanded': menuHovered }"
      @mouseenter="handleMainMenuHover"
      @mouseleave="handleMainMenuHover"
    >
      <li
        v-for="{ path, name, meta } in menuItems"
        :key="`c-main-menu__item--${name}`"
        class="c-main-menu__item"
        :style="{ 'background-color': getMenuItemColor(meta.hue) }"
      >
        <router-link :to="path" class="c-main-menu__item-link">
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
  </nav>
</template>
<script>
import colors from "@/utils/colors";

export default {
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
    handleMainMenuHover(e) {
      this.menuHovered = e.type === "mouseenter";
    },
    getMenuItemColor(hue) {
      return colors.getMenuItemColor(hue);
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

.c-the-main-nav {
  position: relative;
  height: fit-content;
  width: 100%;

  top: 265px;

  display: flex;
  flex-direction: column;

  pointer-events: all;
}

.c-main-menu {
  position: relative;
  width: $menu-item-width--expanded;
  max-width: $menu-item-width;

  left: calc(#{$lefter-width} / 2 - #{$menu-item-width} / 2);

  padding: $outline-width;

  overflow: hidden;

  font-family: Poppins;
  font-size: 30px;

  transition: max-width 200ms ease-in-out;

  &--expanded {
    max-width: $menu-item-width--expanded;

    transition: max-width 200ms ease-in-out;
  }

  &__item {
    height: $menu-item-height;
    width: 100%;
    margin-bottom: 13px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &-link {
      width: 100%;
      height: 100%;
      white-space: nowrap;

      text-decoration: none;
    }

    &-content {
      width: $menu-item-width--expanded--visual;
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
