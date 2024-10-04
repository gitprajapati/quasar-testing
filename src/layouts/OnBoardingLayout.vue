<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar size="70px">
            <img src="../assets/logo.png" />
          </q-avatar>
          <div class="absolute-center">{{ currentTabLabel }}</div>
          <!-- Dynamically change the header -->
        </q-toolbar-title>
        <q-btn
          flat
          @click="rightDrawerOpen = !rightDrawerOpen"
          round
          dense
          icon="menu"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="rightDrawerOpen" show-if-above :width="200">
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item clickable v-ripple @click="toggleDarkMode">
            <q-item-section avatar>
              <q-icon :name="darkMode ? 'dark_mode' : 'light_mode'" />
            </q-item-section>

            <q-item-section>{{ currentThemeLabel }}</q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="translate" />
            </q-item-section>

            <q-item-section
              ><q-btn-dropdown color="primary" label="Language" size="12px">
                <q-list>
                  <q-item clickable v-close-popup @click="$i18n.locale = 'hi'">
                    <q-item-section>
                      <q-item-label>Hindi</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="$i18n.locale = 'en-Us'"
                  >
                    <q-item-section>
                      <q-item-label>English</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>
          <q-item
            to="/UpdateProfile"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Update Profile</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="absolute-bottom-left">
            <q-item-section avatar>
              <q-btn
                color="brown-5"
                label="Logout"
                @click="logoutProcess"
                to="/AuthLayout"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img
              src="https://res.cloudinary.com/dyqtvfh5a/image/upload/v1726404321/mnlx5y33lfvyxzuqbcdc.jpg"
            />
          </q-avatar>
          <div class="text-weight-bold">Name: Ravi Shukla</div>
          <div>@username</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { route } from "quasar/wrappers";
import router from "src/router";

export default {
  name: "OnBoardingLayout",

  data() {
    return {
      tab: "profile", // Default to 'chat' tab
      darkMode: this.$q.dark.isActive,
      rightDrawerOpen: false,
      themeMode: "",
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$q.dark.toggle(); // This will toggle the dark mode
    },
    logoutProcess() {
      localStorage.clear("token");
    },
  },
  computed: {
    // Dynamically return the current tab label for the header

    currentThemeLabel() {
      return this.darkMode ? "Dark Mode" : "Light Mode";
    },
  },
};
</script>
