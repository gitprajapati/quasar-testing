<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="loading-overlay">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <h5 class="text-h6 text-center q-mb-md">{{ $t("searchUser") }}</h5>

        <q-form @submit.prevent="performSearch">
          <q-option-group
            v-model="searchType"
            :options="[
              { label: $t('location'), value: 'location' },
              { label: $t('pincode'), value: 'pincode' },
            ]"
            type="radio"
            inline
            @update:model-value="clearSearchResults"
          />

          <div v-if="searchType === 'location'">
            <q-select
              v-model="locationFilters.nagar"
              :options="uniqueNagars"
              :label="$t('selectNagar')"
              outlined
              @update:model-value="updateLocations('mandal')"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    {{ $t("selectNagar") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-model="locationFilters.mandal"
              :options="filteredMandals"
              :label="$t('selectMandal')"
              outlined
              class="q-mt-sm"
              @update:model-value="updateLocations('basti')"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    {{ $t("selectMandal") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-model="locationFilters.basti"
              :options="filteredBastis"
              :label="$t('selectBasti')"
              outlined
              class="q-mt-sm"
              @update:model-value="updateLocationProfessions"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    {{ $t("selectBasti") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-if="locationFilters.basti"
              v-model="locationFilters.profession"
              :options="locationFilteredProfessions"
              label="Profession"
              outlined
              class="q-mt-sm"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    {{ $t("selectProfession") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-else-if="searchType === 'pincode'">
            <q-input
              v-model.number="pincodeFilters.pincode"
              :label="$t('pincodePlaceholder')"
              outlined
              type="number"
              class="q-mt-sm"
              maxlength="6"
              @update:model-value="updatePincodeProfessions"
            />

            <q-select
              v-if="pincodeFilteredProfessions.length > 0"
              v-model="pincodeFilters.profession"
              :options="pincodeFilteredProfessions"
              :label="$t('selectProfession')"
              outlined
              class="q-mt-sm"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    {{ $t("selectProfession") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <q-btn
            type="submit"
            color="primary"
            :label="$t('search')"
            class="q-mt-md full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <div v-if="searchResults.length > 0">
      <h5 class="text-h6 text-center q-mb-md">{{ $t("searchResults") }}</h5>

      <q-card
        v-for="result in searchResults"
        :key="result.username"
        class="q-mb-md"
        flat
        bordered
      >
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text">
              {{ $t("profession") }}: {{ result.profession }}
            </div>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ result.name }}</div>
            <div class="text-caption text-grey">
              {{ $t("workExperience") }}: {{ result.workExperience }}<br />
              {{ $t("jobsCompleted") }}: {{ result.worksCompleted }}<br />
              {{ result.city }}, {{ result.pincode }}<br />
              {{ $t("nagar") }}: {{ result.nagar }}<br />
              {{ $t("mandal") }}: {{ result.mandal }}<br />
              {{ $t("basti") }}: {{ result.basti }}
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-avatar size="100px">
              <img
                :src="
                  result.profile_photo_url
                    ? result.profile_photo_url
                    : profileLogo
                "
                alt="Profile picture"
            /></q-avatar>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            size="10px"
            color="deep-orange"
            glossy
            :label="$t('call')"
            icon="call"
            :href="'tel:' + result.phone"
          />
          <q-btn
            size="10px"
            color="purple"
            :label="$t('whatsapp')"
            icon="fa-brands fa-whatsapp"
            :href="'https://wa.me/' + result.phone"
          />
          <q-btn
            size="10px"
            color="brown-6"
            :label="$t('book')"
            icon="check_circle"
            @click="selectUserForBooking(result)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <div
      v-else-if="searchPerformed && searchResults.length === 0"
      class="text-center"
    >
      <p>{{ $t("noResultsFound") }}</p>
    </div>

    <q-dialog v-model="showBookingConfirmation" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ $t("confirmBooking") }}</span>
        </q-card-section>

        <q-card-section>
          <p>
            {{ $t("aboutToBook") }}
            <strong>{{ selectedUser.name }}</strong> ({{
              selectedUser.profession
            }}).
          </p>
          <p><strong>Important:</strong> {{ $t("contactBeforeBooking") }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
          <q-btn
            :label="$t('confirmBooking')"
            color="primary"
            @click="bookUser"
            :loading="bookingInProgress"
            :disable="bookingInProgress || bookingSuccessful"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
// import { useQuasar } from "quasar";
import profileLogo from "../assets/profile_logo.png";
export default {
  name: "searchPage",
  components: {},
  data() {
    return {
      profileLogo,
      isLoadingRefresh: false,
      isLoading: false,
      searchType: "pincode",
      locationFilters: {
        nagar: null,
        mandal: null,
        basti: null,
        profession: null,
      },
      pincodeFilters: {
        pincode: null,
        profession: null,
      },
      searchResults: [],
      searchPerformed: false,
      allUsers: [],
      locationUsers: [],
      bookingInProgress: false,
      bookingSuccessful: false,
      showBookingConfirmation: false, // Add this line
      selectedUser: null,
    };
  },
  computed: {
    uniqueNagars() {
      return [
        ...new Set(
          this.locationUsers.map((user) => user.nagar).filter(Boolean)
        ),
      ];
    },
    filteredMandals() {
      return [
        ...new Set(
          this.locationUsers
            .filter(
              (user) =>
                !this.locationFilters.nagar ||
                user.nagar === this.locationFilters.nagar
            )
            .map((user) => user.mandal)
            .filter(Boolean)
        ),
      ];
    },
    filteredBastis() {
      return [
        ...new Set(
          this.locationUsers
            .filter(
              (user) =>
                (!this.locationFilters.nagar ||
                  user.nagar === this.locationFilters.nagar) &&
                (!this.locationFilters.mandal ||
                  user.mandal === this.locationFilters.mandal)
            )
            .map((user) => user.basti)
            .filter(Boolean)
        ),
      ];
    },
    locationFilteredProfessions() {
      const { nagar, mandal, basti } = this.locationFilters;
      return [
        ...new Set(
          this.locationUsers
            .filter(
              (user) =>
                (nagar ? user.nagar === nagar : true) &&
                (mandal ? user.mandal === mandal : true) &&
                (basti ? user.basti === basti : true)
            )
            .map((user) => user.profession)
            .filter(Boolean)
        ),
      ];
    },
    pincodeFilteredProfessions() {
      const pincode = this.pincodeFilters.pincode; // Removed .toString()
      if (pincode && pincode.toString().length === 6) {
        return [
          ...new Set(
            this.allUsers
              .filter((user) => user.pincode === pincode) // Removed .toString()
              .map((user) => user.profession)
              .filter(Boolean)
          ),
        ];
      } else {
        return [];
      }
    },
  },
  async mounted() {
    try {
      this.pincodeFilters.pincode = this.getUserPincode();
      await this.fetchAllUsers();
      await this.fetchLocationUsers();
    } catch (error) {
      console.error("Error in mounted:", error);
    }
  },
  methods: {
    selectUserForBooking(user) {
      this.selectedUser = user;
      this.showBookingConfirmation = true;
    },

    async fetchAllUsers() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://kaushal-shakti-backend.vercel.app/api/v1/users?pincode=${this.pincodeFilters.pincode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.allUsers = response.data;
      } catch (error) {
        console.error("Error fetching all users:", error);
        // Handle error, maybe show a notification
      } finally {
        this.isLoading = false;
        this.isLoadingRefresh = false;
      }
    },

    async fetchLocationUsers() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://kaushal-shakti-backend.vercel.app/api/v1/users?pincode=${this.getUserPincode()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.locationUsers = response.data;
      } catch (error) {
        console.error("Error fetching location users:", error);
        // Handle error, maybe show a notification
      } finally {
        this.isLoading = false;
      }
    },

    async updateLocationProfessions() {
      this.clearSearchResults();
    },

    async bookUser() {
      console.log("bookUser function called");
      const currentUser = JSON.parse(localStorage.getItem("userData"));
      try {
        this.bookingInProgress = true;
        this.bookingSuccessful = false;

        const token = localStorage.getItem("token");
        const bookingData = {
          bookedUser: this.selectedUser.username,
          bookedBy: currentUser.username,
          bookingStatus: "Pending", // You should have a way to manage the booking status
          profession: this.selectedUser.profession,
          bookiePhone: this.selectedUser.phone,
          bookerPhone: currentUser.phone,
          worksCompleted: this.selectedUser.worksCompleted,
          bookerName: currentUser.name,
          bookieName: this.selectedUser.name,
          bookieAddress: `${this.selectedUser.gali}, ${this.selectedUser.mandal}, ${this.selectedUser.basti}, ${this.selectedUser.nagar}, ${this.selectedUser.city}, ${this.selectedUser.district}, ${this.selectedUser.state} - ${this.selectedUser.pincode}`,
          bookerAddress: `${currentUser.gali}, ${currentUser.mandal}, ${currentUser.basti}, ${currentUser.nagar}, ${currentUser.city}, ${currentUser.district}, ${currentUser.state} - ${currentUser.pincode}`,
        };

        const response = await axios.post(
          "https://kaushal-shakti-backend.vercel.app/api/v1/bookings",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Booking successful:", response.data);
        this.bookingSuccessful = true;
        // Optionally, you might want to close the dialog here
        // this.$refs.bookingConfirmationDialog.hide();
        alert("Booking successful!");
        this.$router.push("/user-history");
      } catch (error) {
        console.error("Error booking user:", error);
        alert("Error booking user. Please try again later.");
      } finally {
        this.bookingInProgress = false;
      }
    },
    async updatePincodeProfessions() {
      this.clearSearchResults();
      if (this.pincodeFilters.pincode.toString().length === 6) {
        this.isLoading = true;
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://kaushal-shakti-backend.vercel.app/api/v1/users?pincode=${this.pincodeFilters.pincode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.allUsers = response.data;
        } catch (error) {
          console.error("Error fetching users by pincode:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async updateLocations(filterToUpdate) {
      if (filterToUpdate === "mandal") {
        this.locationFilters.mandal = null;
        this.locationFilters.basti = null;
      } else if (filterToUpdate === "basti") {
        this.locationFilters.basti = null;
      }
      this.clearSearchResults();
    },
    clearSearchResults() {
      this.searchResults = [];
      this.searchPerformed = false;
    },
    getUserPincode() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.pincode) {
          return userData.pincode;
        } else {
          console.log("Pincode not found in localStorage user data.");
        }
      } catch (error) {
        console.error("Error getting user pincode from localStorage:", error);
      }
      return null;
    },
    async performSearch() {
      this.isLoading = true;
      this.searchPerformed = true;
      this.searchResults = [];

      if (!this.searchType) {
        // this.$q.notify({
        //   type: "negative",
        //   message: "Please select a search method (Location or Pincode)",
        // });
        alert("Please select a search method (Location or Pincode)");

        this.isLoading = false;
        return;
      }

      let queryString = "";
      if (this.searchType === "location") {
        if (
          !this.locationFilters.nagar &&
          !this.locationFilters.mandal &&
          !this.locationFilters.basti &&
          !this.locationFilters.profession
        ) {
          // this.$q.notify({
          //   type: "negative",
          //   message:
          //     "Please select at least one location field (Nagar, Mandal, Basti) or a profession.",
          // });
          alert(
            "Please select at least one location field (Nagar, Mandal, Basti) or a profession."
          );
          this.isLoading = false;
          return;
        }
        queryString = this.buildQueryString(this.locationFilters);
      } else if (this.searchType === "pincode") {
        if (
          !this.pincodeFilters.pincode ||
          this.pincodeFilters.pincode.toString().length !== 6
        ) {
          // this.$q.notify({
          //   type: "negative",
          //   message: "Please enter a valid 6-digit pincode.",
          // });
          alert("Please enter a valid 6-digit pincode.");
          this.isLoading = false;
          return;
        }
        queryString = this.buildQueryString(this.pincodeFilters);
      }

      if (queryString) {
        const apiEndpoint = `https://kaushal-shakti-backend.vercel.app/api/v1/users?${queryString}`;
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(apiEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.searchResults = response.data;
        } catch (error) {
          console.error("Error during search:", error);
          // Handle error, maybe show a notification
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    },
    buildQueryString(params) {
      return Object.entries(params)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
