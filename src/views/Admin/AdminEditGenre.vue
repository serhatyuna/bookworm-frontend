<template>
  <div class="container mx-auto my-16">
    <h1>Update the genre</h1>
    <form class="create-book-form" @submit="submitForm">
      <span @click="goBack" class="goback">
        <svg width="20" height="30">
          <polyline points="15 5 5 15 15 25" stroke="currentColor" stroke-width="3" stroke-linecap="butt" fill="none" stroke-linejoin="round">&gt;</polyline>
        </svg>
      </span>

      <input type="text" v-model.trim="$v.type.$model" placeholder="Type" required autofocus :class="{ 'error': $v.type.$error }">
      <div class="error-message" v-if="!formValid && (!$v.type.required)">Type is required!</div>
      <div class="error-message" v-if="!formValid && !$v.type.maxLength">Type cannot be more than 32 characters!</div>

      <input type="submit" value="Update">
    </form>
  </div>
</template>

<script>
import {
  required, maxLength,
} from 'vuelidate/lib/validators';

export default {
  name: 'CreateGenre',
  data() {
    return {
      type: '',
      formValid: true,
      error: '',
    };
  },
  validations: {
    type: {
      required,
      maxLength: maxLength(32),
    },
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.formValid = false;
      } else {
        this.$http.put(`genres/${this.$route.params.genreID}`, { type: this.type })
          .then(() => {
            alert('The genre is updated successfully');
            this.$router.push({ name: 'adminhome' });
          })
          .catch(() => {
            alert('There is an error!');
            this.$router.go();
          });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  created() {
    this.$http.get(`genres/${this.$route.params.genreID}`)
      .then((response) => {
        this.type = response.data.genre.type;
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
