<template>
  <q-page class="q-pa-sm"
    ><q-pull-to-refresh @refresh="fetchOrderHistory">
      <div class="row q-col-gutter-sm">
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-card class="card-bg text-white no-shadow" bordered>
            <q-card-section class="text-center bg-transparent">
              <q-avatar size="100px" class="shadow-10">
                <img src="profile.svg" />
              </q-avatar>
              <div class="text-h6 q-mt-md">Abhishek Prasad</div>
            </q-card-section>
            <q-card-section>
              <div>
                <strong>{{ $t("name") }}:</strong>
              </div>
              <div><strong>Sang Pravesh:</strong></div>
              <div><strong>Daitva:</strong></div>
              <div><strong>Branch:</strong></div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-card class="card-bg text-white no-shadow" bordered>
            <q-card-section>
              <div class="text-h6">Info</div>
              <div>
                <strong>Phone:</strong>
              </div>
              <div><strong>Highest Education:</strong></div>
              <div><strong>Sikchad:</strong></div>
              <div><strong>Profession:</strong></div>
              <div><strong>Years Of Exp.:</strong></div>
              <div><strong>Jobs Completed:</strong></div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-card class="card-bg text-white no-shadow" bordered>
            <q-card-section>
              <div class="text-h6">Address</div>
              <div>
                <strong>State:</strong>
              </div>
              <div><strong>District:</strong></div>
              <div><strong>Pincode:</strong></div>
              <div><strong>City:</strong></div>
              <div><strong>Nagar:</strong></div>
              <div><strong>Basti:</strong></div>
              <div><strong>Gali:</strong></div>
            </q-card-section>
          </q-card>
        </div>
      </div></q-pull-to-refresh
    >
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserProfile",
  data() {
    return {
      user_details: {},
      password_dict: {},
    };
  },
  methods: {
    fetchOrderHistory(done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
  },
});
</script>

<style scoped>
.card-bg {
  background-color: #162b4d;
}
</style>
