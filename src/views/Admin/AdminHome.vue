/* eslint-disable dot-notation */
<template>
  <div class="home mx-auto">
    <admin-header @headerLinkChanged="changeActiveLink" />
    <modal name="showmore-modal" :width="600" :height="500">
      <div class="flex w-full h-full flex-col px-8 py-12 justify-center items-center overflow-y-scroll">
        <p class="flex-grow">{{ showMoreContent }}</p>
        <button @click="$modal.hide('showmore-modal')" class="w-full h-10 bg-indigo-800 text-white flex justify-center items-center">CLOSE</button>
      </div>
    </modal>
    <modal name="delete-modal" :width="540" :height="120">
      <div v-if="!deleteAccepted" class="flex w-full h-full flex-col pt-8 justify-between items-center">
          <p>Are you sure you want to delete this {{ deleteArray }}?</p>
          <div class="w-full flex">
            <button @click="executeDelete" class="w-1/2 h-10 bg-red-600 shadow-inner hover:bg-red-700 text-white">DELETE</button>
            <button @click="$modal.hide('delete-modal')" class="w-1/2 h-10 bg-gray-200 shadow-inner text-gray-900 hover:bg-gray-700 hover:text-white">CANCEL</button>
          </div>
        </div>
        <div v-else class="flex w-full h-full flex-col pt-8 justify-between items-center">
          <img v-if="deleteLoading" src="../../assets/loading.gif" alt="Loading" class="mt-4">
          <p v-else-if="deleteError && !deleteErrorMessage">There is a server error. Please try again...</p>
          <p v-else-if="deleteErrorMessage">{{ deleteErrorMessage }}</p>
          <p v-else>Deleted successfully!</p>
          <button v-if="!deleteLoading" @click="$modal.hide('delete-modal')" class="w-full h-10 bg-indigo-800 text-white">CLOSE</button>
        </div>
    </modal>
    <h1 class="font-bold text-xl text-center mt-8 mb-6">All {{ activeLink | capitalize }}</h1>
    <div class="books px-8 mb-12">
      <div class="mb-8">
        <div v-if="activeLink === 'books'" class="mx-auto w-40">
          <router-link :to="{ name: 'createbook' }" class="inline-block w-full p-4 mr-8 bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100 text-center">Create Book</router-link>
        </div>
        <div v-if="activeLink === 'genres'" class="mx-auto w-40">
          <router-link :to="{ name: 'creategenre' }" class="inline-block w-full p-4 mr-8 bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100 text-center">Create Genre</router-link>
        </div>
        <div v-if="activeLink === 'authors'" class="mx-auto w-40">
          <router-link :to="{ name: 'createauthor' }" class="inline-block w-full p-4 mr-8 bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100 text-center">Create Author</router-link>
        </div>
      </div>
      <table v-if="activeLink === 'books'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">Cover</th>
            <th class="px-2 py-2">Title</th>
            <th class="px-2 py-2">ISBN</th>
            <th class="px-2 py-2">Description</th>
            <th class="px-2 py-2">Released Year</th>
            <th class="px-2 py-2">Language</th>
            <th class="px-2 py-2"># of Pages</th>
            <th class="px-2 py-2">Author</th>
            <th class="px-2 py-2">Genre</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Edit / Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" :key="'allbooks' + book.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="align-middle border px-2 py-2">{{ book.id }}</td>
            <td class="align-middle border px-2 py-2"><a :href="book.cover" target="_blank"><img class="w-12 h-20" :src="book.cover"></a></td>
            <td class="align-middle border px-2 py-2"><router-link :to="{ name: 'book', params: { id: book.id } }" class="text-blue-800 hover:underline">{{ book.title }}</router-link></td>
            <td class="align-middle border px-2 py-2">{{ book.isbn }}</td>
            <td v-if="book.description.length < 50" class="align-middle border px-2 py-2">{{ book.description | showLess }}</td>
            <td v-else class="align-middle border px-2 py-2">{{ book.description | showLess }}<span class="cursor-pointer text-blue-700" @click="showMore('books', index)">... show more</span></td>
            <td class="align-middle border px-2 py-2">{{ book.releasedYear }}</td>
            <td class="align-middle border px-2 py-2">{{ book.language }}</td>
            <td class="align-middle border px-2 py-2">{{ book.pageNumber }}</td>
            <td class="align-middle border px-2 py-2">{{ book.Author.firstName }} {{ book.Author.lastName }}</td>
            <td class="align-middle border px-2 py-2">{{ book.Genre.type }}</td>
            <td class="align-middle border px-2 py-2"><time :datetime="book.createdAt">{{ book.createdAt | convertDate }}</time></td>
            <td class="align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <router-link :to="{ name: 'editbook', params: { bookID: book.id }}" class="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-2 text-sm">Edit</router-link>
                <button @click="showDeleteModal('books', book.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'users'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">Username</th>
            <th class="px-2 py-2">First Name</th>
            <th class="px-2 py-2">Last Name</th>
            <th class="px-2 py-2">Email</th>
            <th class="px-2 py-2">User Role</th>
            <th class="px-2 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="'allusers' + user.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="align-middle border px-2 py-2">{{ user.id }}</td>
            <td class="align-middle border px-2 py-2"><router-link :to="{ name: 'profile', params: { username: user.username } }" class="text-blue-800 hover:underline">{{ user.username }}</router-link></td>
            <td class="align-middle border px-2 py-2">{{ user.firstName }}</td>
            <td class="align-middle border px-2 py-2">{{ user.lastName }}</td>
            <td class="align-middle border px-2 py-2">{{ user.email }}</td>
            <td class="align-middle border px-2 py-2">{{ user.userRole | userRole }}</td>
            <td class="align-middle border px-2 py-2"><time :datetime="user.createdAt">{{ user.createdAt | convertDate }}</time></td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'genres'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">Type</th>
            <th class="px-2 py-2">Number of Books</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Edit / Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(genre, index) in genres" :key="'allgenres' + genre.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ genre.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ genre.type }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ genre.number_of_books }}</td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="genre.createdAt">{{ genre.createdAt | convertDate }}</time></td>
            <td class="text-center align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <router-link :to="{ name: 'editgenre', params: { genreID: genre.id }}" class="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-2 text-sm">Edit</router-link>
                <button @click="showDeleteModal('genres', genre.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'authors'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">First Name</th>
            <th class="px-2 py-2">Last Name</th>
            <th class="px-2 py-2">Biography</th>
            <th class="px-2 py-2">Number of Books</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Edit / Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(author, index) in authors" :key="'allauthors' + author.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ author.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ author.firstName }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ author.lastName }}</td>
            <td v-if="author.biography.length < 50" class="text-center align-middle border px-2 py-2">{{ author.biography | showLess }}</td>
            <td v-else class="text-center align-middle border px-2 py-2">{{ author.biography | showLess }}<span class="cursor-pointer text-blue-700" @click="showMore('authors', index)">... show more</span></td>
            <td class="text-center align-middle border px-2 py-2">{{ author.number_of_books }}</td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="author.createdAt">{{ author.createdAt | convertDate }}</time></td>
            <td class="text-center align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <router-link :to="{ name: 'editauthor', params: { authorID: author.id }}" class="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-2 text-sm">Edit</router-link>
                <button @click="showDeleteModal('authors', author.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'reviews'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">User</th>
            <th class="px-2 py-2">Book</th>
            <th class="px-2 py-2">Content</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, index) in reviews" :key="'allreviews' + review.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ review.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ review.User.username }} ({{ review.userID }})</td>
            <td class="text-center align-middle border px-2 py-2">{{ review.Book.title }} ({{ review.bookID }})</td>
            <td v-if="review.content.length < 50" class="text-center align-middle border px-2 py-2">{{ review.content | showLess }}</td>
            <td v-else class="text-center align-middle border px-2 py-2">{{ review.content | showLess }}<span class="cursor-pointer text-blue-700" @click="showMore('reviews', index)">... show more</span></td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="review.createdAt">{{ review.createdAt | convertDate }}</time></td>
            <td class="text-center align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <button @click="showDeleteModal('reviews', review.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'favorites'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">User</th>
            <th class="px-2 py-2">Book</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(favorite, index) in favorites" :key="'allfavorites' + favorite.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ favorite.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ favorite.User.username }} ({{ favorite.userID }})</td>
            <td class="text-center align-middle border px-2 py-2">{{ favorite.Book.title }} ({{ favorite.bookID }})</td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="favorite.createdAt">{{ favorite.createdAt | convertDate }}</time></td>
            <td class="text-center align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <button @click="showDeleteModal('favorites', favorite.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'likes'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">Who Liked?</th>
            <th class="px-2 py-2">Who Reviewed?</th>
            <th class="px-2 py-2">Book</th>
            <th class="px-2 py-2">Review ID</th>
            <th class="px-2 py-2">Review Content</th>
            <th class="px-2 py-2">Created At</th>
            <th class="px-2 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(like, index) in likes" :key="'alllikes' + like.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ like.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ like.User.username }} ({{ like.User.id }})</td>
            <td class="text-center align-middle border px-2 py-2">{{ like.Review.User.username }} ({{ like.Review.User.id }})</td>
            <td class="text-center align-middle border px-2 py-2">{{ like.Review.Book.title }} ({{ like.Review.Book.id }})</td>
            <td class="text-center align-middle border px-2 py-2">{{ like.Review.id }}</td>
            <td v-if="like.Review.content.length < 50" class="text-center align-middle border px-2 py-2">{{ like.Review.content | showLess }}</td>
            <td v-else class="text-center align-middle border px-2 py-2">{{ like.Review.content | showLess }}<span class="cursor-pointer text-blue-700" @click="showMore('likes', index)">... show more</span></td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="like.createdAt">{{ like.createdAt | convertDate }}</time></td>
            <td class="text-center align-middle border px-2 py-2">
              <div class="flex flex-col justify-center items-center">
                <button @click="showDeleteModal('likes', like.id)" class="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeLink === 'logs'" class="table-auto mx-auto">
        <thead>
          <tr>
            <th class="px-2 py-2">ID</th>
            <th class="px-2 py-2">Event</th>
            <th class="px-2 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, index) in logs" :key="'alllogs' + log.id" :class="index % 2 === 0 ? 'bg-gray-100': ''">
            <td class="text-center align-middle border px-2 py-2">{{ log.id }}</td>
            <td class="text-center align-middle border px-2 py-2">{{ log.User.username }} ({{ log.User.id }}) {{ log.event }}</td>
            <td class="text-center align-middle border px-2 py-2"><time :datetime="log.createdAt">{{ log.createdAt | convertDate }}</time></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminHeader from '../../components/Admin/AdminHeader.vue';

export default {
  name: 'adminhome',
  data() {
    return {
      activeLink: 'books',
      error: '',
      books: [],
      users: [],
      genres: [],
      authors: [],
      reviews: [],
      favorites: [],
      likes: [],
      logs: [],
      showMoreContent: '',
      deleteAccepted: false,
      deleteArray: '',
      deleteID: -1,
      deleteLoading: true,
      deleteError: false,
      deleteErrorMessage: '',
    };
  },
  components: {
    'admin-header': AdminHeader,
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    changeActiveLink(value) {
      this.activeLink = value;
    },
    showMore(arrayName, index) {
      switch (arrayName) {
        case 'books':
          this.showMoreContent = this.books[index].description;
          this.$modal.show('showmore-modal');
          break;
        case 'authors':
          this.showMoreContent = this.authors[index].biography;
          this.$modal.show('showmore-modal');
          break;
        case 'reviews':
          this.showMoreContent = this.reviews[index].content;
          this.$modal.show('showmore-modal');
          break;
        case 'likes':
          this.showMoreContent = this.likes[index].Review.content;
          this.$modal.show('showmore-modal');
          break;
        default:
          break;
      }
    },
    showDeleteModal(array, id) {
      this.deleteArray = array;
      this.deleteID = id;
      this.deleteAccepted = false;
      this.deleteLoading = true;
      this.deleteError = false;
      this.deleteErrorMessage = '';
      this.$modal.show('delete-modal');
    },
    executeDelete() {
      this.deleteAccepted = true;
      let URI;
      if (this.deleteArray === 'reviews' || this.deleteArray === 'favorites' || this.deleteArray === 'likes') {
        URI = `${this.deleteArray}/admin/${this.deleteID}`;
      } else {
        URI = `${this.deleteArray}/${this.deleteID}`;
      }

      this.$http.delete(URI)
        .then(() => {
          setTimeout(() => {
            this[this.deleteArray] = this[this.deleteArray].filter(e => e.id !== this.deleteID);
            this.deleteID = -1;
            this.deleteLoading = false;
            this.deleteError = false;
            this.deleteErrorMessage = '';
          }, 200);
        })
        .catch((err) => {
          if (err && err.response) {
            this.deleteErrorMessage = err.response.data.message;
          } else {
            this.deleteErrorMessage = '';
          }
          setTimeout(() => {
            this.deleteID = -1;
            this.deleteLoading = false;
            this.deleteError = true;
            this.deleteErrorMessage = '';
          }, 200);
        });
    },
  },
  created() {
    this.$http.get('books')
      .then((response) => {
        this.books = response.data.books;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('users')
      .then((response) => {
        this.users = response.data.users;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('genres')
      .then((response) => {
        this.genres = response.data.genres;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('authors')
      .then((response) => {
        this.authors = response.data.authors;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('reviews')
      .then((response) => {
        this.reviews = response.data.reviews;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('favorites')
      .then((response) => {
        this.favorites = response.data.favorites;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('likes')
      .then((response) => {
        this.likes = response.data.likes;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
    this.$http.get('logs')
      .then((response) => {
        this.logs = response.data.logs;
      })
      .catch((err) => {
        if (err && err.response) {
          this.error = err.response.data.message;
        }
      });
  },
  filters: {
    showLess(value) {
      return value.substring(0, 50);
    },
    convertDate(value) {
      const date = new Date(value);
      return date.toLocaleString('tr-TR');
    },
    userRole(value) {
      return value === true ? 'Admin' : 'User';
    },
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
