<template>
  <div class="app-wrapper flex flex-col min-h-screen">
    <header-nav />
    <main class="flex-grow">
      <div class="random-books container mx-auto">
        <h2 class="text font-bold uppercase tracking-widest text-gray-500 mb-8 mt-4 ml-14 xxl:ml-0">Newest books</h2>
        <div class="flex justify-around xxl:justify-between">
          <p v-if="newestLoading">Loading...</p>
          <p v-else-if="!newestLoading && newestBooksError">There is an error to fetch the newest books. Please refresh the page!</p>
          <div v-else v-for="(newestBook, index) in newestBooks" :key="'newestbook' + index" class="w-36 xxl:w-56">
            <div :style="`background-image: url('${newestBook.cover}')`" class="book-bg w-36 h-56 xxl:w-56 xxl:h-72 bg-no-repeat bg-cover bg-center">
              <router-link :to="'/book/' + newestBook.id" class="w-36 h-56 xxl:w-56 xxl:h-72 block"></router-link>
            </div>
            <router-link :to="'/book/' + newestBook.id" class="book-title mt-6 mb-3 font-medium block">{{ newestBook.title }}</router-link>
            <span class="text-xs text-gray-500">{{newestBook.authorFirstName}} {{newestBook.authorLastName}}</span>
          </div>
        </div>
        <h2 class="text font-bold uppercase tracking-widest text-gray-500 mb-8 mt-12 ml-14 xxl:ml-0">Most liked this month</h2>
        <div class="flex justify-around xxl:justify-between">
          <p v-if="mostLikedLoading">Loading...</p>
          <p v-else-if="!mostLikedLoading && mostLikedBooksError">There is an error to fetch the mostLiked books. Please refresh the page!</p>
          <div v-else v-for="(mostLikedBook, index) in mostLikedBooks" :key="'mostLikedbook' + index" class="w-36 xxl:w-56">
            <div :style="`background-image: url('${mostLikedBook.cover}')`" class="book-bg w-36 h-56 xxl:w-56 xxl:h-72 bg-no-repeat bg-cover bg-center">
              <router-link :to="'/book/' + mostLikedBook.id" class="w-36 h-56 xxl:w-56 xxl:h-72 block"></router-link>
            </div>
            <router-link :to="'/book/' + mostLikedBook.id" class="book-title mt-6 mb-3 font-medium block">{{ mostLikedBook.title }}</router-link>
            <span class="text-xs text-gray-500">{{mostLikedBook.authorFirstName}} {{mostLikedBook.authorLastName}}</span>
          </div>
        </div>
        <h2 class="text font-bold uppercase tracking-widest text-gray-500 mb-8 mt-12 ml-14 xxl:ml-0">Random books for you</h2>
        <div class="flex justify-around xxl:justify-between">
          <p v-if="randomLoading">Loading...</p>
          <p v-else-if="!randomLoading && randomBooksError">There is an error to fetch the random books. Please refresh the page!</p>
          <div v-else v-for="(randomBook, index) in randomBooks" :key="'randombook' + index" class="w-36 xxl:w-56">
            <div :style="`background-image: url('${randomBook.cover}')`" class="book-bg w-36 h-56 xxl:w-56 xxl:h-72 bg-no-repeat bg-cover bg-center">
              <router-link :to="'/book/' + randomBook.id" class="w-36 h-56 xxl:w-56 xxl:h-72 block"></router-link>
            </div>
            <router-link :to="'/book/' + randomBook.id" class="book-title mt-6 mb-3 font-medium block">{{ randomBook.title }}</router-link>
            <span class="text-xs text-gray-500">{{randomBook.authorFirstName}} {{randomBook.authorLastName}}</span>
          </div>
        </div>
        <div class="flex justify-around items-center my-4">
          <div v-if="typeof mostPopularAuthor !== 'undefined' && Object.keys(mostPopularAuthor).length !== 0 || mostPopularAuthor.constructor !== Object" class="w-30/100 flex flex-col justify-center items-center">
            <div>
              <h2 class="text-center font-bold uppercase tracking-widest text-gray-500 mb-8 mt-12 xxl:ml-0">Most popular author</h2>
              <div>
              </div>
              <p v-if="mostPopularAuthorLoading">Loading...</p>
              <p v-else-if="!mostPopularAuthorLoading && mostPopularAuthorError">There is an error to fetch the most popular author. Please refresh the page!</p>
              <div v-else class="relative">
                <div class="most-popular-author w-64 h-36"></div>
                <div class="most-popular-text w-64 h-36 flex justify-center items-center">
                  <span class="text-xl font-bold text-white py-2 px-3">{{ mostPopularAuthor.firstName }} {{ mostPopularAuthor.lastName }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="typeof mostPopularGenre !== 'undefined' && Object.keys(mostPopularGenre).length !== 0 || mostPopularGenre.constructor !== Object" class="w-30/100 flex flex-col justify-center items-center">
            <div>
              <h2 class="text-center font-bold mb-4 uppercase tracking-widest text-gray-500 mb-8 mt-12 xxl:ml-0">Most popular genre</h2>
              <div>
              </div>
              <p v-if="mostPopularGenreLoading">Loading...</p>
              <p v-else-if="!mostPopularGenreLoading && mostPopularGenreError">There is an error to fetch the most popular genre. Please refresh the page!</p>
              <div v-else class="relative">
                <div class="most-popular-genre w-64 h-36"></div>
                <div class="most-popular-text w-64 h-36 flex justify-center items-center">
                  <span class="text-xl font-bold text-white py-2 px-3">{{ mostPopularGenre.type }}</span>
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
  name: 'home',
  components: {
    'header-nav': headerNav,
    'footer-bottom': footerBottom,
  },
  data() {
    return {
      randomBooks: [],
      randomLoading: true,
      randomBooksError: false,
      newestBooks: [],
      newestLoading: true,
      newestBooksError: false,
      mostLikedBooks: [],
      mostLikedLoading: true,
      mostLikedBooksError: false,
      mostPopularGenre: {},
      mostPopularGenreLoading: true,
      mostPopularGenreError: false,
      mostPopularAuthor: {},
      mostPopularAuthorLoading: true,
      mostPopularAuthorError: false,
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  created() {
    this.$http.get('books/random')
      .then((response) => {
        this.randomBooks = response.data.books;
        this.randomLoading = false;
      })
      .catch(() => {
        this.randomBooksError = true;
        this.randomLoading = false;
      });
    this.$http.get('books/newest')
      .then((response) => {
        this.newestBooks = response.data.books;
        this.newestLoading = false;
      })
      .catch(() => {
        this.newestBooksError = true;
        this.newestLoading = false;
      });
    this.$http.get('books/mostliked')
      .then((response) => {
        const [books] = response.data.books;
        this.mostLikedBooks = books;
        this.mostLikedLoading = false;
      })
      .catch(() => {
        this.mostLikedBooksError = true;
        this.mostLikedLoading = false;
      });
    this.$http.get('genres/mostpopular')
      .then((response) => {
        this.mostPopularGenre = response.data.genre;
        this.mostPopularGenreLoading = false;
      })
      .catch(() => {
        this.mostPopularGenreError = true;
        this.mostPopularGenreLoading = false;
      });
    this.$http.get('authors/mostpopular')
      .then((response) => {
        this.mostPopularAuthor = response.data.author;
        this.mostPopularAuthorLoading = false;
      })
      .catch(() => {
        this.mostPopularAuthorError = true;
        this.mostPopularAuthorLoading = false;
      });
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
    .random-books {
      h2 {
        font-family: 'PT Sans', 'Open Sans', sans-serif;
      }
    }

    .most-popular-author {
      background-image: url('../assets/most_popular_author.jpg');
      background-position: -6px -6px;
      background-size: fit;
      background-repeat: no-repeat;
    }

    .most-popular-text {
      position: absolute;
      top: 0;
      left: 0;

      span {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }

    .most-popular-genre {
      background-image: url('../assets/most_popular_genre.jpg');
      background-position: -28px -6px;
      background-size: fit;
      background-repeat: no-repeat;
    }

    .book-bg {
      transition: opacity .15s ease-in-out;
      box-shadow:
        -3.3px 3.3px 0.6px -0 rgba(0, 0, 0, 0.056),
        -4.6px 4.6px 1.4px -0 rgba(0, 0, 0, 0.081),
        -5.3px 5.3px 2.6px -0 rgba(0, 0, 0, 0.1),
        -6px 6px 4.7px -0 rgba(0, 0, 0, 0.119),
        -7.2px 7.2px 8.8px -0 rgba(0, 0, 0, 0.144),
        -11px 11px 21px -0 rgba(0, 0, 0, 0.2);

      &:hover {
        opacity: 0.9;
      }
    }

    .book-title {
      font-family: 'Roboto Slab', 'Merriweather', serif;
    }
  }
}
</style>
