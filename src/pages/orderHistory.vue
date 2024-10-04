<template>
  <q-page class="q-pa-md">
    <q-pull-to-refresh @refresh="fetchOrderHistory">
      <!-- <div v-if="isLoading" class="loading-overlay">
        <q-spinner-dots color="primary" size="3em" />
      </div> -->
      <!-- Booking View Toggle -->

      <q-card class="q-mb-md">
        <q-card-section>
          <h5 class="text-center">{{ $t("viewBookings") }}</h5>

          <div class="q-gutter-sm">
            <q-radio
              v-model="bookingView"
              val="bookedByMe"
              :label="$t('bookedByMe')"
              color="primary"
            />
            <q-radio
              v-model="bookingView"
              val="bookedForMe"
              :label="$t('bookedForMe')"
              color="primary"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Order History Section -->
      <div v-if="filteredOrderHistory.length > 0">
        <q-card flat class="q-mb-md">
          <q-card-section>
            <h4 class="text-center">{{ $t("orderHistory") }}</h4>
            <q-separator />
          </q-card-section>
        </q-card>

        <!-- Display each order -->
        <div
          v-for="order in filteredOrderHistory"
          :key="order.booking_id"
          class="q-mb-md"
        >
          <q-card flat bordered class="q-pa-sm q-mb-md">
            <q-card-section>
              <div class="q-mb-md">
                <p>
                  <strong>{{ $t("orderId") }}:</strong> {{ order.booking_id }}
                </p>
                <p>
                  <strong>{{ $t("date") }}:</strong>
                  {{ formatDate(order.bookingDateTime) }}
                </p>
                <p>
                  <strong>{{ $t("time") }}:</strong>
                  {{ formatTime(order.bookingDateTime) }}
                </p>
                <p>
                  <strong>{{ $t("profession") }}:</strong>
                  {{ order.profession }}
                </p>
                <p v-if="bookingView === 'bookedByMe'">
                  <strong>{{ $t("bookedPersonName") }}:</strong>
                  {{ order.bookieName }}
                </p>
                <p v-else>
                  <strong>{{ $t("bookedByName") }}:</strong>
                  {{ order.bookerName }}
                </p>
                <p>
                  <strong>{{ $t("status") }}:</strong>
                  <span :class="getStatusColor(order.bookingStatus)">
                    {{ order.bookingStatus }}
                  </span>
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="row q-col-gutter-sm q-py-xs">
                <q-btn
                  flat
                  color="primary"
                  class="q-mr-sm"
                  @click="toggleOrderDetails(order)"
                  :label="
                    order.showDetails
                      ? $t('hide')
                      : $t('show') + ' ' + $t('details')
                  "
                />

                <!-- Button for "Booked By Me" -->
                <q-btn
                  v-if="
                    bookingView === 'bookedByMe' &&
                    order.bookingStatus === 'Accepted'
                  "
                  flat
                  color="green"
                  @click="
                    confirmBooking(order.booking_id, order.bookingDateTime)
                  "
                  icon="check"
                  :label="$t('confirmDone')"
                />

                <!-- Buttons for "Booked For Me" -->
                <q-btn
                  v-if="
                    bookingView === 'bookedForMe' &&
                    order.bookingStatus === 'Pending'
                  "
                  flat
                  color="green"
                  @click="
                    acceptBooking(order.booking_id, order.bookingDateTime)
                  "
                  icon="check"
                  :label="$t('acceptBooking')"
                />
                <q-btn
                  v-if="
                    bookingView === 'bookedForMe' &&
                    order.bookingStatus === 'Pending'
                  "
                  flat
                  color="red"
                  @click="
                    rejectBooking(order.booking_id, order.bookingDateTime)
                  "
                  icon="cancel"
                  :label="$t('rejectBooking')"
                />
              </div>
            </q-card-section>

            <!-- Order Details Section -->
            <q-card v-if="order.showDetails" dense>
              <q-card-section>
                <div v-if="bookingView === 'bookedByMe'">
                  <p>
                    <strong>{{ $t("customerPhone") }}:</strong>
                    {{ order.bookiePhone }}
                  </p>
                  <p>
                    <strong>{{ $t("address") }}:</strong>
                    {{ order.bookieAddress }}
                  </p>

                  <!-- Rating Submission -->
                  <div
                    v-if="order.bookingStatus === 'Completed' && !order.rating"
                  >
                    <q-card-section>
                      <q-rating
                        v-model="selectedRating"
                        color="yellow"
                        icon="star"
                        max="5"
                      />
                      <div>Selected Rating: {{ selectedRating }}</div>
                    </q-card-section>
                    <q-btn
                      color="primary"
                      size="sm"
                      @click="
                        submitRating(order.booking_id, order.bookingDateTime)
                      "
                      :label="$t('submitRating')"
                    />
                  </div>
                  <div v-if="order.rating">
                    <p>
                      <strong>{{ $t("yourRating") }}:</strong>
                      {{ order.rating }}
                    </p>
                  </div>
                </div>

                <div v-else-if="bookingView === 'bookedForMe'">
                  <p>
                    <strong>{{ $t("BookerPhone") }}:</strong>
                    {{ order.bookerPhone }}
                  </p>
                  <p>
                    <strong>{{ $t("BookerAddress") }}:</strong>
                    {{ order.bookerAddress }}
                  </p>
                </div>
              </q-card-section>
            </q-card>
          </q-card>
        </div>
      </div>

      <!-- No Order History -->
      <div v-else-if="!isLoading" class="text-center">
        <q-card class="q-pa-md q-ma-md">
          <p>{{ $t("noOrderHistory") }}</p>
        </q-card>
      </div></q-pull-to-refresh
    >
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "orderHistory",
  data() {
    return {
      isLoadingRefresh: false,
      bookingView: "bookedByMe",
      orderHistory: [],
      showOrderDetails: false,
      selectedRating: 0,
      currentUser: {},
      isLoading: false,
    };
  },
  computed: {
    filteredOrderHistory() {
      if (this.bookingView === "bookedByMe") {
        return this.orderHistory.filter(
          (order) => order.bookedBy === this.currentUser.username
        );
      } else if (this.bookingView === "bookedForMe") {
        return this.orderHistory.filter(
          (order) => order.bookedUser === this.currentUser.username
        );
      } else {
        return this.orderHistory;
      }
    },
  },
  mounted() {
    this.fetchOrderHistory();
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
  },
  methods: {
    getStatusColor(status) {
      if (status === "Completed") {
        return "text-success";
      } else if (status === "Rejected") {
        return "text-danger";
      } else {
        return "text-warning";
      }
    },
    toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
    },
    formatDate(isoDateString) {
      const date = new Date(isoDateString);
      return date.toLocaleDateString();
    },
    formatTime(isoDateString) {
      const date = new Date(isoDateString);
      return date.toLocaleTimeString();
    },
    async fetchOrderHistory() {
      try {
        this.isLoading = true;
        const username = JSON.parse(localStorage.getItem("userData")).username;
        const response = await axios.get(
          `https://kaushal-shakti-backend.vercel.app/api/v1/bookings/${username}`
        );
        this.orderHistory = response.data;
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        this.isLoading = false;
        this.isLoadingRefresh = false;
      }
    },
    async confirmBooking(bookingId, bookingDateTime) {
      this.isLoading = true;
      try {
        await axios.put(
          `https://kaushal-shakti-backend.vercel.app/api/v1/bookings/${bookingId}`,
          {
            bookingStatus: "Completed",
            booking_datetime: bookingDateTime,
          }
        );
        const orderIndex = this.orderHistory.findIndex(
          (order) => order.booking_id === bookingId
        );
        if (orderIndex !== -1) {
          this.orderHistory[orderIndex].bookingStatus = "Completed";
        }
      } catch (error) {
        console.error("Error confirming booking:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async acceptBooking(bookingId, bookingDateTime) {
      this.isLoading = true;
      try {
        await axios.put(
          `https://kaushal-shakti-backend.vercel.app/api/v1/bookings/${bookingId}`,
          {
            bookingStatus: "Accepted",
            booking_datetime: bookingDateTime,
          }
        );
        const orderIndex = this.orderHistory.findIndex(
          (order) => order.booking_id === bookingId
        );
        if (orderIndex !== -1) {
          this.orderHistory[orderIndex].bookingStatus = "Accepted";
        }
      } catch (error) {
        console.error("Error accepting booking:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async rejectBooking(bookingId, bookingDateTime) {
      this.isLoading = true;
      try {
        await axios.put(
          `https://kaushal-shakti-backend.vercel.app/api/v1/bookings/${bookingId}`,
          {
            bookingStatus: "Rejected",
            booking_datetime: bookingDateTime,
          }
        );
        const orderIndex = this.orderHistory.findIndex(
          (order) => order.booking_id === bookingId
        );
        if (orderIndex !== -1) {
          this.orderHistory[orderIndex].bookingStatus = "Rejected";
        }
      } catch (error) {
        console.error("Error rejecting booking:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async submitRating(bookingId, bookingDateTime) {
      this.isLoading = true;
      try {
        await axios.put(
          `https://kaushal-shakti-backend.vercel.app/api/v1/bookings/${bookingId}`,
          {
            rating: this.selectedRating,
            booking_datetime: bookingDateTime,
          }
        );
        const orderIndex = this.orderHistory.findIndex(
          (order) => order.booking_id === bookingId
        );
        if (orderIndex !== -1) {
          this.orderHistory[orderIndex].rating = this.selectedRating;
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.text-success {
  color: green;
}
.text-danger {
  color: red;
}
.text-warning {
  color: orange;
}
.q-card-section p {
  margin: 5px 0;
}
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
