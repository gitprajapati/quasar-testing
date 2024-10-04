<template>
  <q-page class="flex bg-image flex-center">
    <q-card
      v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Find Nearby Admin</div>
        <div class="text-subtitle2">Search by pincode.</div> </q-card-section
      ><q-separator />

      <q-card-actions>
        <q-input
          rounded
          outlined
          v-model="text"
          class="full-width"
          placeholder="Enter 6-digit Pincode"
        >
          <template v-slot:append>
            <q-icon name="my_location" />
          </template>
        </q-input>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "registerPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
};
</script>

<style></style>
