<template>
  <div class="app-wrapper flex flex-col min-h-screen">
    <header-nav />
    <main class="flex-grow">
      <div class="container mx-auto mb-8">
        <p v-if="userLoading">Loading...</p>
        <p v-else-if="userError && userErrorMessage">{{ userErrorMessage }}</p>
        <p v-else-if="userError && !userErrorMessage">Couldn't fetch the data. Please refresh the page!</p>
        <div v-else class="flex flex-col items-center">
          <div class="flex flex-col items-center">
            <div class="w-36 h-36">
              <img class="w-36 h-36" :src="'https://avatars.dicebear.com/v2/gridy/' + user.username + '.svg'" :alt="user.firstName + ' ' + user.lastName">
            </div>
            <h2 class="mt-2 text-base uppercase tracking-wider text-gray-800">{{ user.firstName }} {{ user.lastName }}</h2>
            <span class="text-gray-500 mt-1 text-sm">@{{ user.username }}</span>
          </div>

          <modal name="delete-review-modal" :width="540" :height="120">
          <div v-if="!reviewDeleteAccepted" class="flex w-full h-full flex-col pt-8 justify-between items-center">
            <p>Are you sure you want to delete this review?</p>
            <div class="w-full flex">
              <button @click="executeDeleteReview" class="w-1/2 h-10 bg-red-600 shadow-inner hover:bg-red-700 text-white">DELETE</button>
              <button @click="$modal.hide('delete-review-modal')" class="w-1/2 h-10 bg-gray-200 shadow-inner text-gray-900 hover:bg-gray-700 hover:text-white">CANCEL</button>
            </div>
          </div>
          <div v-else class="flex w-full h-full flex-col pt-8 justify-between items-center">
            <img v-if="deleteReviewLoading" src="../assets/loading.gif" alt="Loading" class="mt-4">
            <p v-else-if="deleteReviewError && !deleteReviewErrorMessage">There is a server error. Please try again...</p>
            <p v-else-if="deleteReviewErrorMessage">{{ deleteReviewErrorMessage }}</p>
            <p v-else>The review is deleted successfully!</p>
            <button v-if="!deleteReviewLoading" @click="$modal.hide('delete-review-modal')" class="w-full h-10 bg-indigo-800 text-white">CLOSE</button>
          </div>
        </modal>

          <div class="mx-auto w-9/12 flex mt-16 justify-between">
            <div class="w-45/100">
              <p v-if="favoritesLoading">Loading...</p>
              <p v-else-if="favoritesError && favoritesErrorMessage">{{ favoritesErrorMessage }}</p>
              <p v-else-if="favoritesError && !favoritesErrorMessage">Couldn't fetch the data. Please refresh the page!</p>
              <div v-else>
                <h3 class="text-xl mb-4 text-gray-800">Favorite Books</h3>
                <p v-if="favorites.length === 0">There is no favorite book yet!</p>
                <div v-for="favorite in favorites" :key="'favbook' + favorite.id" class="flex mt-6">
                  <div :style="`background-image: url('${favorite.Book.cover}')`" class="book-bg w-16 h-20 bg-no-repeat bg-cover bg-center shadow-md">
                    <router-link :to="'/book/' + favorite.Book.id" class="w-16 h-20 block"></router-link>
                  </div>
                  <div class="flex flex-col ml-3">
                    <router-link :to="'/book/' + favorite.Book.id" class="text-lg text-gray-800"><span>{{ favorite.Book.title }}</span></router-link>
                    <span class="text-sm text-gray-600 mt-1">{{ favorite.Book.Author.firstName }} {{ favorite.Book.Author.lastName }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-45/100">
              <h3 class="text-xl mb-4 text-gray-800">Reviews</h3>
              <p v-if="reviewsLoading">Loading...</p>
              <p v-else-if="reviewsError && reviewsErrorMessage">{{ reviewsErrorMessage }}</p>
              <p v-else-if="reviewsError && !reviewsErrorMessage">Couldn't fetch the data. Please refresh the page!</p>
              <div v-else>
                <p v-if="reviews.length === 0">There is no favorite book yet!</p>
                <div v-else v-for="review in reviews" :key="'reviews' + review.id" class="flex mt-6">
                  <div class="flex flex-col">
                    <router-link :to="'/book/' + review.bookID" class="text-lg text-gray-800"><span>{{ review.title }}</span></router-link>
                    <div class="mr-4">
                      <span v-if="review.countOfLikes <= 1" class="text-xs text-gray-600 mt-1">Like: {{ review.countOfLikes }}</span>
                      <span v-else class="text-xs text-gray-600 mt-1">Likes: {{ review.countOfLikes }}</span>
                      <button v-if="review.userID === getUser.id" @click="deleteReview(review.id)" class="text-red-600 hover:text-red-700 focus:outline-none focus:shadow-md text-xs ml-2">| Delete Review</button>
                    </div>
                    <p v-html="review.content" class="mt-3 text-sm leading-tight"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer-bottom />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import headerNav from '../components/Header.vue';
import footerBottom from '../components/Footer.vue';

export default {
  name: 'profile',
  data() {
    return {
      user: {},
      userLoading: true,
      userError: false,
      userErrorMessage: '',
      favorites: [],
      favoritesLoading: true,
      favoritesError: false,
      favoritesErrorMessage: '',
      reviews: [],
      reviewsLoading: true,
      reviewsError: false,
      reviewsErrorMessage: '',
      reviewDeleteAccepted: false,
      reviewIDToDelete: -1,
      deleteReviewLoading: true,
      deleteReviewError: true,
      deleteReviewErrorMessage: '',
    };
  },
  components: {
    'header-nav': headerNav,
    'footer-bottom': footerBottom,
  },
  methods: {
    getUserData(username) {
      this.$http.get(`users/profile/${username}`)
        .then((response) => {
          this.user = response.data.user;
          this.userLoading = false;
          this.userError = false;
          this.userErrorMessage = '';

          this.$http.get(`favorites/user/${this.user.id}`)
            .then((favoritesResponse) => {
              this.favorites = favoritesResponse.data.favorites;
              this.favoritesLoading = false;
              this.favoritesError = false;
              this.favoritesErrorMessage = '';
            })
            .catch((err) => {
              if (err && err.response) {
                this.favoritesErrorMessage = err.response.data.message;
              } else {
                this.favoritesErrorMessage = '';
              }
              this.favoritesError = true;
              this.favoritesLoading = false;
            });

          this.$http.get(`reviews/user/${this.user.id}`)
            .then((reviewsResponse) => {
              this.reviews = reviewsResponse.data.reviews;
              this.reviewsLoading = false;
              this.reviewsError = false;
              this.reviewsErrorMessage = '';
            })
            .catch((err) => {
              if (err && err.response) {
                this.reviewsErrorMessage = err.response.data.message;
              } else {
                this.reviewsErrorMessage = '';
              }
              this.reviewsError = true;
              this.reviewsLoading = false;
            });
        })
        .catch((err) => {
          if (err && err.response) {
            this.userErrorMessage = err.response.data.message;
          } else {
            this.userErrorMessage = '';
          }
          this.userError = true;
          this.userLoading = false;
        });
    },
    reset() {
      this.user = {};
      this.userLoading = true;
      this.userError = false;
      this.userErrorMessage = '';
      this.favorites = [];
      this.favoritesLoading = true;
      this.favoritesError = false;
      this.favoritesErrorMessage = '';
      this.reviews = [];
      this.reviewsLoading = true;
      this.reviewsError = false;
      this.reviewsErrorMessage = '';
      this.reviewDeleteAccepted = false;
      this.reviewIDToDelete = -1;
      this.deleteReviewLoading = true;
      this.deleteReviewError = true;
      this.deleteReviewErrorMessage = '';
    },
    deleteReview(reviewID) {
      this.$modal.show('delete-review-modal');
      this.reviewDeleteAccepted = false;
      this.reviewIDToDelete = reviewID;
    },
    executeDeleteReview() {
      this.reviewDeleteAccepted = true;
      if (this.reviewIDToDelete > 0) {
        this.$http.delete(`reviews/${this.reviewIDToDelete}`)
          .then(() => {
            setTimeout(() => {
              this.reviews = this.reviews.filter(review => review.id !== this.reviewIDToDelete);
              this.reviewIDToDelete = -1;
              this.deleteReviewLoading = false;
              this.deleteReviewError = false;
              this.deleteReviewErrorMessage = '';
            }, 200);
          })
          .catch((err) => {
            if (err && err.response) {
              this.deleteReviewErrorMessage = err.response.data.message;
            } else {
              this.deleteReviewErrorMessage = '';
            }
            setTimeout(() => {
              this.reviewIDToDelete = -1;
              this.deleteReviewLoading = false;
              this.deleteReviewError = true;
              this.deleteReviewErrorMessage = '';
            }, 200);
          });
      }
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  created() {
    this.getUserData(this.$route.params.username);
  },
  beforeRouteUpdate(to, from, next) {
    this.reset();
    this.getUserData(to.params.username);
    next();
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  font-family: 'PT Sans', 'Open Sans', sans-serif;

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Merriweather', serif;
  }

  main {
    .book-bg {
      transition: opacity .15s ease-in-out;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
