<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="90">
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

                <q-item clickable v-close-popup @click="$i18n.locale = 'en-Us'">
                  <q-item-section>
                    <q-item-label>English</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-tab-panels v-model="tab" animated swipeable>
        <q-tab-panel name="login">
          <loginPage />
        </q-tab-panel>

        <q-tab-panel name="register">
          <registerPage />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-dark">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" icon="login" />
          <q-separator vertical />
          <q-tab name="register" label="Register" icon="how_to_reg" />
        </q-tabs>
      </q-card>
    </q-footer>
  </q-layout>
</template>

<script>
import loginPage from "pages/loginPage.vue";
import registerPage from "pages/registerPage.vue";

export default {
  name: "AuthLayout",

  components: {
    loginPage,
    registerPage,
  },

  data() {
    return {
      tab: "login", // Default to 'chat' tab
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
  },
  computed: {
    // Dynamically return the current tab label for the header
    currentTabLabel() {
      switch (this.tab) {
        case "login":
          return "Login";
        case "register":
          return "Register";

        default:
          return "Free Chat";
      }
    },
    currentThemeLabel() {
      return this.darkMode ? "Dark Mode" : "Light Mode";
    },
  },
};
</script>
<style>
.q-tab-panel {
  padding: 0px;
}
</style>
