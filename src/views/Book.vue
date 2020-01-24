<template>
  <div class="app-wrapper flex flex-col min-h-screen">
    <header-nav />
    <main class="flex-grow -mt-4">
      <modal name="favorite-modal" :width="540" :height="120">
        <div class="flex w-full h-full flex-col pt-8 justify-between items-center">
          <img v-if="favoriteLoading" src="../assets/loading.gif" alt="Loading" class="mt-4">
          <p v-else-if="favoriteError">There is a server error. Please try again...</p>
          <p v-else-if="isFavorited">Added to your favorite books!</p>
          <p v-else-if="!isFavorited">Removed from your favorite books!</p>
          <button v-if="!favoriteLoading" @click="$modal.hide('favorite-modal')" class="w-full h-10 bg-indigo-800 text-white">CLOSE</button>
        </div>
      </modal>
      <modal name="review-modal" :width="540" :height="120">
        <div class="flex w-full h-full flex-col pt-8 justify-between items-center">
          <img v-if="createReviewLoading" src="../assets/loading.gif" alt="Loading" class="mt-4">
          <p v-else-if="createReviewError && !createReviewErrorMessage">There is a server error. Please try again...</p>
          <p v-else-if="createReviewErrorMessage">{{ createReviewErrorMessage }}</p>
          <p v-else>Your review is published now!</p>
          <button v-if="!createReviewLoading" @click="$modal.hide('review-modal')" class="w-full h-10 bg-indigo-800 text-white">CLOSE</button>
        </div>
      </modal>
      <modal name="like-modal" :width="540" :height="120">
        <div class="flex w-full h-full flex-col pt-8 justify-between items-center">
          <img v-if="likeLoading" src="../assets/loading.gif" alt="Loading" class="mt-4">
          <p v-else-if="likeError && !likeErrorMessage">There is a server error. Please try again...</p>
          <p v-else-if="likeErrorMessage">{{ likeErrorMessage }}</p>
          <p v-else>{{ likeSuccessMessage }}</p>
          <button v-if="!likeLoading" @click="$modal.hide('like-modal')" class="w-full h-10 bg-indigo-800 text-white">CLOSE</button>
        </div>
      </modal>
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
      <div class="book-detail-container w-full h-220 bg-no-repeat bg-bottom bg-auto">
        <div class="container mx-auto pt-16">
          <div v-if="!loading">
            <h2 v-if="!loading" class="text-center text-3xl uppercase tracking-widest text-white mb-3">{{ book.title }}</h2>
            <p class="text-center text-sm text-gray-300">by {{book.Author.firstName}} {{book.Author.lastName}} in {{ book.releasedYear }}</p>
            <div class="w-56 mx-auto mt-12">
              <div :style="`background-image: url('${book.cover}')`" class="w-56 h-72 bg-no-repeat bg-cover bg-center"></div>
              <div @click="toggleFavorite" :class="isFavorited ? 'favorited' : 'not-favorited'" class="bg-gray-100 border border-solid border-gray-200 px-2 py-2 flex justify-center items-center cursor-pointer shadow-lg">
                <svg style="transition: all .2s ease-in-out;" class="w-6 h-6 text-transparent hover:text-red-600 cursor-pointer mr-2" viewBox="0 0 24 24" fill="currentColor" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span v-if="isFavorited" class="uppercase tracking-wider text-xs">Remove from favorites</span>
                <span v-else class="uppercase tracking-wider text-xs">Add to favorites</span>
              </div>
            </div>
            <div class="w-7/12 mx-auto flex justify-around items-center bg-indigo-200 py-4 mt-8 rounded shadow-xl">
              <div class="w-22/100 flex flex-col items-center">
                <span class="px-4 py-4 text-indigo-900 font-bold border-b border-solid border-indigo-400">Genre</span>
                <span class="py-4 text-sm text-indigo-800">{{ book.Genre.type }}</span>
              </div>
              <div class="w-22/100 flex flex-col items-center">
                <span class="px-4 py-4 text-indigo-900 font-bold border-b border-solid border-indigo-400">Language</span>
                <span class="py-4 text-sm text-indigo-800">{{ book.language }}</span>
              </div>
              <div class="w-22/100 flex flex-col items-center">
                <span class="px-4 py-4 text-indigo-900 font-bold border-b border-solid border-indigo-400">Number of pages</span>
                <span class="py-4 text-sm text-indigo-800">{{ book.pageNumber }}</span>
              </div>
              <div class="w-22/100 flex flex-col items-center">
                <span class="px-10 py-4 text-indigo-900 font-bold border-b border-solid border-indigo-400">ISBN</span>
                <span class="py-4 text-sm text-indigo-800">{{ book.isbn }}</span>
              </div>
            </div>
          </div>
          <p v-if="!loading && error">There is an error to fetch the book data. Please refresh the page!</p>
          <p v-if="loading">Loading...</p>
        </div>
      </div>

      <div v-if="!loading && book.description != ''" class="container mx-auto -mt-32 mb-8">
        <div class="w-2/3 mx-auto bg-gray-100 shadow px-8 py-12 leading-snug">
          <div class="flex items-center mb-5">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">DESCRIPTION</h3>
          </div>
          <p class="text-gray-800" v-html="book.description"></p>
        </div>
      </div>

      <div v-if="!loading && !error" class="container mx-auto my-8">
        <div class="w-2/3 mx-auto bg-gray-100 shadow px-8 py-12 leading-snug">
          <div class="flex items-center mb-5">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">REVIEWS</h3>
          </div>
          <div v-if="reviewsLoading">Loading...</div>
          <div v-else-if="reviewsErrorMessage" class="mb-4">{{ reviewsErrorMessage }}</div>
          <div v-else-if="reviewsError" class="mb-4">Couldn't fetch the reviews. Please try to refresh the page!</div>
          <div>
            <div class="flex flex-col items-center">
              <textarea v-model="newReview" class="w-10/12 h-36 mb-6 p-4 shadow-md rounded-lg" style="min-height: 144px" placeholder="Start to write your review for this book..."></textarea>
              <button @click="createReview" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow">PUBLISH YOUR REVIEW</button>
            </div>
            <div v-if="!reviewsLoading">
              <div v-for="(review, index) in reviews" :key="'review' + review.id" class="mt-8">
                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-full border border-solid border-gray-500 flex justify-center items-center mr-3">
                    <img class="w-8 h-8" :src="'https://avatars.dicebear.com/v2/gridy/' + review.username + '.svg'" :alt="review.firstName + ' ' + review.lastName">
                  </div>
                  <div class="flex flex-col justify-center flex-grow">
                    <span class="text-gray-800 text-sm">{{ review.firstName }} {{ review.lastName }}</span>
                    <div class="text-gray-500 text-xs">
                      <router-link :to="'/profile/' + review.username" class="text-gray-500 text-xs">
                        <span>@{{ review.username }}</span>
                      </router-link> -
                      <timeago :datetime="review.createdAt"></timeago>
                    </div>
                  </div>
                  <div v-if="review.userID === getUser.id" class="mr-4">
                    <button @click="deleteReview(review.id)" class="w-36 h-8 rounded bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-md flex justify-center items-center">
                      <span class="text-white text-sm mr-2">Delete Review</span>
                      <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-gray-900">{{ review.content }}</p>
                </div>
                <div :class="review.isLiked ? ['bg-green-700', 'hover:bg-green-600'] : ['bg-blue-700', 'hover:bg-blue-600']" class="w-16 h-6 mr-2 py-2 px-4 mt-3 rounded-full cursor-pointer flex justify-between items-center" @click="toggleLike(index, review.id)">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span class="text-white">{{ review.countOfLikes }}</span>
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
  name: 'book',
  data() {
    return {
      book: {},
      loading: true,
      error: false,
      isFavorited: false,
      favoriteLoading: true,
      favoriteError: false,
      reviews: [],
      reviewsLoading: true,
      reviewsError: false,
      reviewsErrorMessage: '',
      newReview: '',
      createReviewLoading: true,
      createReviewError: false,
      createReviewErrorMessage: '',
      likeLoading: true,
      likeError: false,
      likeErrorMessage: '',
      likeSuccessMessage: 'Review liked!',
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
    toggleFavorite() {
      if (this.isFavorited) {
        this.isFavorited = false;
        this.$modal.show('favorite-modal');
        this.$http.delete(`favorites/${this.book.id}`)
          .then(() => {
            setTimeout(() => {
              this.favoriteLoading = false;
            }, 200);
          })
          .catch(() => {
            this.isFavorited = true;
            setTimeout(() => {
              this.favoriteLoading = false;
              this.favoriteError = true;
            }, 200);
          });
      } else {
        this.isFavorited = true;
        this.$modal.show('favorite-modal');
        this.$http.post('favorites/create', { bookID: this.book.id })
          .then(() => {
            setTimeout(() => {
              this.favoriteLoading = false;
            }, 200);
          })
          .catch(() => {
            this.isFavorited = false;
            setTimeout(() => {
              this.favoriteLoading = false;
              this.favoriteError = true;
            }, 200);
          });
      }
    },
    createReview() {
      this.newReview = this.newReview.trim();
      if (this.newReview) {
        this.$modal.show('review-modal');
        this.$http.post('reviews/create', {
          bookID: this.book.id,
          content: this.newReview,
        })
          .then((response) => {
            setTimeout(() => {
              const review = {
                ...response.data.review,
                username: this.getUser.username,
                firstName: this.getUser.firstName,
                lastName: this.getUser.lastName,
                countOfLikes: 0,
                isLiked: 0,
              };
              this.reviews.unshift(review);
              this.reviewsErrorMessage = '';
              this.reviewsError = false;
              this.newReview = '';
              this.createReviewLoading = false;
              this.createReviewErrorMessage = '';
            }, 200);
          })
          .catch((err) => {
            if (err && err.response) {
              this.createReviewErrorMessage = err.response.data.message;
            } else {
              this.createReviewErrorMessage = '';
            }
            setTimeout(() => {
              this.createReviewLoading = false;
              this.createReviewError = true;
            }, 200);
          });
      }
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
    toggleLike(index, reviewID) {
      this.$modal.show('like-modal');
      if (!this.reviews[index].isLiked) {
        this.likeSuccessMessage = 'Review liked!';
        this.$http.post('likes/create', { reviewID })
          .then(() => {
            this.reviews[index].isLiked = true;
            this.reviews[index].countOfLikes = this.reviews[index].countOfLikes + 1;
            setTimeout(() => {
              this.likeErrorMessage = '';
              this.likeError = false;
              this.likeLoading = false;
            }, 200);
          })
          .catch((err) => {
            if (err && err.response) {
              this.likeErrorMessage = err.response.data.message;
            } else {
              this.likeErrorMessage = '';
            }
            setTimeout(() => {
              this.likeLoading = false;
              this.likeError = true;
            }, 200);
          });
      } else {
        this.likeSuccessMessage = 'Like revoked!';
        this.$http.delete(`likes/${reviewID}`, { reviewID })
          .then(() => {
            this.reviews[index].isLiked = false;
            this.reviews[index].countOfLikes = this.reviews[index].countOfLikes - 1;
            setTimeout(() => {
              this.likeErrorMessage = '';
              this.likeError = false;
              this.likeLoading = false;
            }, 200);
          })
          .catch((err) => {
            if (err && err.response) {
              this.likeErrorMessage = err.response.data.message;
            } else {
              this.likeErrorMessage = '';
            }
            setTimeout(() => {
              this.likeLoading = false;
              this.likeError = true;
            }, 200);
          });
      }
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  created() {
    this.$http.get(`books/${this.$route.params.id}`)
      .then((response) => {
        this.book = response.data.book;
        this.$http.get(`favorites/book/${response.data.book.id}`)
          .then(() => {
            this.isFavorited = true;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          })
          .finally(() => {
            this.$http.get(`reviews/book/${this.book.id}`)
              .then((reviewsResponse) => {
                this.reviews = reviewsResponse.data.reviews;
                this.reviewsLoading = false;
              })
              .catch((err) => {
                if (err && err.response) {
                  this.reviewsErrorMessage = err.response.data.message;
                } else {
                  this.reviewsErrorMessage = '';
                }
                this.reviewsLoading = false;
                this.reviewsError = true;
              });
          });
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  font-family: 'PT Sans', 'Open Sans', sans-serif;

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Roboto Slab', 'Merriweather', serif;
  }

  main {
    .book-detail-container {
      background-image: url('../assets/book-details-bg.jpg');
      background-position: -50px -50px;
    }

    .favorited > svg {
      color: #e53e3e;
    }

    .not-favorited > svg {
      color: transparent;
    }

    .favorited:hover > svg {
      color: transparent;
    }

    .not-favorited:hover > svg {
      color: #e53e3e;
    }
  }
}
</style>
