<template>
  <q-page padding>
    <q-tab-panels v-model="tab" animated swipeable>
      <q-tab-panel name="profile">
        <profilePage />
      </q-tab-panel>

      <q-tab-panel name="search">
        <searchPage />
      </q-tab-panel>
      <q-tab-panel name="orderhistory">
        <orderHistory />
      </q-tab-panel>
    </q-tab-panels>
    <q-footer elevated class="bg-grey-8 text-dark">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-deep-purple-3'"
          align="justify"
          narrow-indicator
        >
          <q-tab name="profile" label="Profile" icon="person" />
          <q-separator vertical />
          <q-tab name="search" label="Search" icon="search" />

          <q-separator vertical />
          <q-tab name="orderhistory" label="Order History" icon="history" />
        </q-tabs>
      </q-card>
    </q-footer>
  </q-page>
</template>

<script>
import profilePage from "pages/profilePage.vue";
import searchPage from "pages/searchPage.vue";
import orderHistory from "pages/orderHistory.vue";

export default {
  name: "OnBoardingPage",
  data() {
    return {
      tab: "profile",
    };
  },
  components: {
    profilePage,
    searchPage,
    orderHistory,
  },
  computed: {
    currentTabLabel() {
      switch (this.tab) {
        case "profile":
          return "Profile";
        case "orderhistory":
          return "Order History";
        case "search":
          return "Search";
        default:
          return "Free Chat";
      }
    },
  },
};
</script>
