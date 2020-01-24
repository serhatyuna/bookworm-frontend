<template>
  <div class="container mx-auto my-16">
    <h1>Update the book</h1>
    <form class="create-book-form" @submit="submitForm">
      <span @click="goBack" class="goback">
        <svg width="20" height="30">
          <polyline points="15 5 5 15 15 25" stroke="currentColor" stroke-width="3" stroke-linecap="butt" fill="none" stroke-linejoin="round">&gt;</polyline>
        </svg>
      </span>

      <input type="text" v-model.trim="$v.title.$model" placeholder="Title" required autofocus :class="{ 'error': $v.title.$error }">
      <div class="error-message" v-if="!formValid && (!$v.title.required)">Title is required!</div>
      <div class="error-message" v-if="!formValid && !$v.title.maxLength">Title cannot be more than 255 characters!</div>

      <textarea cols="30" rows="10" v-model.trim="$v.description.$model" placeholder="Description" required :class="{ 'error': $v.description.$error }"></textarea>
      <div class="error-message" v-if="!formValid && !$v.description.required">Description is required!</div>

      <input type="text" v-model.trim="$v.isbn.$model" placeholder="ISBN" required :class="{ 'error': $v.isbn.$error }">
      <div class="error-message" v-if="!formValid && !$v.isbn.required">ISBN is required!</div>
      <div class="error-message" v-if="!formValid && !$v.isbn.maxLength">ISBN cannot be more than 15 characters!</div>

      <input type="text" v-model.trim="$v.cover.$model" placeholder="Cover URL" required :class="{ 'error': $v.cover.$error }">
      <div class="error-message" v-if="!formValid && !$v.cover.required">Cover URL is required!</div>
      <div class="error-message" v-if="!formValid && !$v.cover.url">Cover URL should be a valid URL!</div>

      <input type="number" min="1" max="2100" v-model.number="$v.releasedYear.$model" placeholder="Released year" required :class="{ 'error': $v.releasedYear.$error }">
      <div class="error-message" v-if="!formValid && !$v.releasedYear.required">Released year is required!</div>
      <div class="error-message" v-if="!formValid && !$v.releasedYear.between">Released year should be between 1 and 2100!</div>

      <input type="text" v-model.trim="$v.language.$model" placeholder="Language" required :class="{ 'error': $v.language.$error }">
      <div class="error-message" v-if="!formValid && !$v.language.required">Language is required!</div>
      <div class="error-message" v-if="!formValid && !$v.language.maxLength">Language cannot be more than 32 characters!</div>

      <input type="number" min="1" v-model.number="$v.pageNumber.$model" placeholder="Page number" required :class="{ 'error': $v.pageNumber.$error }">
      <div class="error-message" v-if="!formValid && !$v.pageNumber.required">Page number is required!</div>

      <select v-model.number="$v.genreID.$model">
        <option value="-1">Please select a genre</option>
        <option v-for="genre in genres" :key="'genre' + genre.id" :value="genre.id">
          {{ genre.type }}
        </option>
      </select>
      <div class="error-message" v-if="!formValid && ($v.genreID.$model === -1 || !$v.genreID.required)">Genre is required!</div>

      <select v-model.number="$v.authorID.$model">
        <option value="-1">Please select an author</option>
        <option v-for="author in authors" :key="'author' + author.id" :value="author.id">
          {{ author.firstName }} {{ author.lastName }}
        </option>
      </select>
      <div class="error-message" v-if="!formValid && ($v.authorID.$model === -1 || !$v.authorID.required)">Author is required!</div>

      <input type="submit" value="Update">
    </form>
  </div>
</template>

<script>
import {
  required, maxLength, between, url, minValue,
} from 'vuelidate/lib/validators';

export default {
  name: 'CreateBook',
  data() {
    return {
      isbn: '',
      title: '',
      description: '',
      cover: '',
      releasedYear: null,
      language: '',
      pageNumber: null,
      authorID: null,
      genreID: null,
      authors: [],
      genres: [],
      formValid: true,
      error: '',
    };
  },
  validations: {
    isbn: {
      required,
      maxLength: maxLength(15),
    },
    title: {
      required,
      maxLength: maxLength(255),
    },
    description: {
      required,
    },
    cover: {
      required,
      url,
    },
    releasedYear: {
      required,
      between: between(1, 2100),
    },
    language: {
      required,
      maxLength: maxLength(32),
    },
    pageNumber: {
      required,
    },
    authorID: {
      required,
      minValue: minValue(1),
    },
    genreID: {
      required,
      minValue: minValue(1),
    },
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.formValid = false;
      } else {
        this.$http.put(`books/${this.$route.params.bookID}`, {
          isbn: this.isbn,
          title: this.title,
          description: this.description,
          cover: this.cover,
          releasedYear: this.releasedYear,
          language: this.language,
          pageNumber: this.pageNumber,
          authorID: this.authorID,
          genreID: this.genreID,
        }).then((response) => {
          if (response.data.status) {
            alert('The book is updated successfully');
            this.$router.push({ name: 'adminhome' });
          } else {
            alert('There is an error!');
            this.$router.go();
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  created() {
    this.$http.get(`books/${this.$route.params.bookID}`)
      .then((response) => {
        this.isbn = response.data.book.isbn;
        this.title = response.data.book.title;
        this.description = response.data.book.description;
        this.cover = response.data.book.cover;
        this.releasedYear = response.data.book.releasedYear;
        this.language = response.data.book.language;
        this.pageNumber = response.data.book.pageNumber;
        this.authorID = response.data.book.authorID;
        this.genreID = response.data.book.genreID;
      })
      .catch((error) => {
        console.log(error);
      });
    this.$http.get('authors')
      .then((response) => {
        if (response.data.status) {
          this.authors = response.data.authors;
        } else {
          this.error = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.$http.get('genres')
      .then((response) => {
        if (response.data.status) {
          this.genres = response.data.genres;
        } else {
          this.error = response.data.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped>
.container {
  font-family: 'Open Sans', sans-serif;
  h1 {
    margin-top: 20px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
  }
  .create-book-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    input, textarea, select {
      margin: 10px;
      width: 60%;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #a0aec0;
      font-family: inherit;
      font-size: 14px;
      transition: border .2s ease-in-out;
      &:focus {
        border: 1px solid #718096;
      }
    }
    input[type=submit] {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 13px;
      background-color: #c3dafe;
      color: #434190;
      border: 1px solid #a3bffa;
      box-shadow: 1px 1px 2px 0px rgba(60,54,107,0.3);
      transition: all .2s ease-in-out;
      &:hover {
        background-color: #a3bffa;
        color: #3c366b;
        border: 1px solid #7f9cf5;
      }
      &:focus {
        background-color: #7f9cf5;
        color: #ebf4ff;
      }
    }
    .error {
      border: 1px solid #e53e3e;
    }
    .error-message {
      font-size: 13px;
      color: #e53e3e;
      width: 100%;
      margin-left: 360px;
    }
    textarea {
      font-family: inherit;
      font-size: 14px;
    }
    .goback {
      position: fixed;
      top: 10px;
      left: 10px;
      width: 40px;
      height: 40px;
      background-color: #fed7d7;
      color: #742a2a;
      border-radius: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
