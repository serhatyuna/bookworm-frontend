<template>
  <div class="landing">
    <header>
      <div class="header-container">
        <div class="logo">
          <h1><span class="logo-bold">book</span>worm</h1>
          <span class="motto">Meet your favourite book.</span>
        </div>

        <div class="login">
          <modal name="login-modal" :width="540" :height="120">
              <img v-if="loginWaiting" src="../assets/loading.gif" alt="Loading">
              <p v-else-if="loginError">{{ loginError }}</p>
              <p v-else>You have successfully logged in! Now redirecting to home page...</p>
          </modal>
          <form @submit="userLogin">
            <fieldset class="login-field-set">
              <input type="text" v-model="$v.login.username.$model" name="username" placeholder="Username" autofocus required :class="{ 'error': loginFormValid ? false : $v.login.username.$error }">
              <div class="error-message" v-if="!loginFormValid && !$v.login.username.required">Username is required!</div>
              <div class="error-message" v-if="!loginFormValid && !$v.login.username.maxLength">Username cannot be more than 32 characters!</div>
            </fieldset>
            <fieldset class="login-field-set">
              <div class="eye-icon" @click="loginPasswordHidden = !loginPasswordHidden">
                <eye-icon :is-eye-on="loginPasswordHidden" />
              </div>
              <input :type="loginPasswordHidden ? 'password' : 'text'" v-model="$v.login.password.$model" name="password" placeholder="Password" required :class="{ 'error': loginFormValid ? false : $v.login.password.$error }">
              <div class="error-message" v-if="!loginFormValid && !$v.login.password.required">Password is required!</div>
              <div class="error-message" v-if="!loginFormValid && !$v.login.password.maxLength">Password cannot be more than 32 characters!</div>
            </fieldset>
            <input type="submit" value="Log in">
          </form>
        </div>
      </div>
    </header>
    <div class="content">
      <div class="content-wrapper">
        <modal name="register-modal" :width="560" :height="130">
          <img v-if="registerWaiting" src="../assets/loading.gif" alt="Loading">
          <p v-else-if="registerError">{{ registerError }}</p>
          <p v-else>You have successfully registered and logged in! Now redirecting to home page...</p>
        </modal>
        <div class="register">
          <h3>New here? Create a free account!</h3>
          <form class="registerForm" @submit="userRegister">
            <label for="">First Name</label>
            <fieldset>
              <input type="text" v-model="$v.register.firstName.$model" name="firstName" placeholder="Enter your first name" required :class="{ 'error': registerFormValid ? false : $v.register.firstName.$error }">
              <div class="error-message" v-if="!registerFormValid && !$v.register.firstName.required">First name is required!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.firstName.maxLength">First name cannot be more than 32 characters!</div>
            </fieldset>
            <label for="">Last Name</label>
            <fieldset>
              <input type="text" v-model="$v.register.lastName.$model" name="lastName" placeholder="Enter your last name" required :class="{ 'error': registerFormValid ? false : $v.register.lastName.$error }">
              <div class="error-message" v-if="!registerFormValid && !$v.register.lastName.required">Last name is required!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.lastName.maxLength">Last name cannot be more than 32 characters!</div>
            </fieldset>
            <label for="">Username</label>
            <fieldset>
              <input type="text" v-model="$v.register.username.$model" name="username" placeholder="Enter username" required :class="{ 'error': registerFormValid ? false : $v.register.username.$error }">
              <div class="error-message" v-if="!registerFormValid && !$v.register.username.required">Username is required!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.username.maxLength">Username cannot be more than 32 characters!</div>
            </fieldset>
            <label for="">E-mail</label>
            <fieldset>
              <input type="text" v-model="$v.register.email.$model" name="email" placeholder="Enter e-mail" required :class="{ 'error': registerFormValid ? false : $v.register.email.$error }">
              <div class="error-message" v-if="!registerFormValid && !$v.register.email.required">Email is required!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.email.maxLength">Email cannot be more than 255 characters!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.email.email">Email must be a valid one!</div>
            </fieldset>
            <label for="">Password</label>
            <fieldset>
              <div class="eye-icon" @click="registerPasswordHidden = !registerPasswordHidden">
                <eye-icon :is-eye-on="registerPasswordHidden" />
              </div>
              <input class="register-password" :type="registerPasswordHidden ? 'password' : 'text'" v-model="$v.register.password.$model" name="password" placeholder="Enter password" required :class="{ 'error': registerFormValid ? false : $v.register.password.$error }">
              <div class="error-message" v-if="!registerFormValid && !$v.register.password.required">Password is required!</div>
              <div class="error-message" v-if="!registerFormValid && !$v.register.password.maxLength">Password cannot be more than 32 characters!</div>
            </fieldset>
            <input type="submit" value="Sign up">
          </form>
        </div>

        <book-illustration class="book-illustration" />
      </div>
    </div>

    <footer>
      <div class="footer-container">
        <section>
          <div class="footer-header">
            <book-svg class="book-svg" />
            <h3>Deciding what to read next?</h3>
          </div>
          <p>You're in the right place. Tell us what titles or genres you've enjoyed in the past, and we'll give you surprisingly insightful recommendations.</p>
        </section>
        <section>
          <div class="footer-header">
            <book-svg class="book-svg" />
            <h3>Discussions</h3>
          </div>
          <p>You can share your opinions about a book or read the reviews of the others. You'll be able to like or dislike a review.</p>
        </section>
        <section>
          <div class="footer-header">
            <book-svg class="book-svg" />
            <h3>Choose your favourite books</h3>
          </div>
          <p>You may want to make a list consists of your favourite books. Bookworm is the right place! Now sign up for free and discover the favourites of the others!</p>
        </section>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  required, maxLength, email,
} from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import BookIllustration from '@/components/BookIllustration.vue';
import BookSvg from '@/components/BookSvg.vue';
import EyeIcon from '@/components/EyeIcon.vue';

export default {
  name: 'landing',
  components: {
    BookIllustration,
    BookSvg,
    EyeIcon,
  },
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
      register: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      },
      loginFormValid: true,
      registerFormValid: true,
      loginWaiting: true,
      registerWaiting: true,
      loginError: '',
      registerError: '',
      loginPasswordHidden: true,
      registerPasswordHidden: true,
    };
  },
  methods: {
    ...mapActions(['logUserIn', 'registerUser']),
    userLogin(e) {
      e.preventDefault();
      this.loginError = '';
      this.loginWaiting = true;
      this.$v.login.$touch();
      if (this.$v.login.$invalid) {
        this.loginFormValid = false;
      } else {
        this.$modal.show('login-modal');
        this.$store.dispatch('logUserIn', {
          username: this.login.username,
          password: this.login.password,
        })
          .then(() => {
            setTimeout(() => {
              this.loginWaiting = false;
            }, 500);
            setTimeout(() => {
              this.$router.push('/admin'); // If the user is not admin, user will be redirected to home page.
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.loginWaiting = false;
            }, 500);
            if (!error.response) {
              this.loginError = 'A server error occurred. Try again later!';
            } else {
              this.loginError = error.response.data.message;
            }
          });
      }
    },
    userRegister(e) {
      e.preventDefault();
      this.registerError = '';
      this.registerWaiting = true;
      this.$v.register.$touch();
      if (this.$v.register.$invalid) {
        this.registerFormValid = false;
      } else {
        this.$modal.show('register-modal');
        this.$store.dispatch('registerUser', {
          firstName: this.register.firstName,
          lastName: this.register.lastName,
          username: this.register.username,
          password: this.register.password,
          email: this.register.email,
        })
          .then(() => {
            setTimeout(() => {
              this.registerWaiting = false;
            }, 500);
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.registerWaiting = false;
            }, 500);
            if (!error.response) {
              this.registerError = 'A server error occurred. Try again later!';
            } else {
              this.registerError = error.response.data.message;
            }
          });
      }
    },
    toggleLoginPassword() {
      this.loginPasswordHidden = !this.loginPasswordHidden;
    },
  },
  validations: {
    login: {
      username: {
        required,
        maxLength: maxLength(32),
      },
      password: {
        required,
        maxLength: maxLength(32),
      },
    },
    register: {
      firstName: {
        required,
        maxLength: maxLength(32),
      },
      lastName: {
        required,
        maxLength: maxLength(32),
      },
      username: {
        required,
        maxLength: maxLength(32),
      },
      email: {
        required,
        email,
        maxLength: maxLength(255),
      },
      password: {
        required,
        maxLength: maxLength(32),
      },
    },
  },
};
</script>

<style lang="scss">
.landing {
  font-family: 'Open Sans', sans-serif;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .v--modal {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
  }

  header {
    .header-container {
      margin-left: auto;
      margin-right: auto;
      max-width: 1600px;
      padding-top: 30px;
      padding-left: 30px;
      padding-right: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .logo {
        h1 {
          font-size: 24px;
          font-family: 'Merriweather', serif;
          margin-bottom: 5px;
        }

        .logo-bold {
          font-weight: bold;
        }

        .motto {
          font-size: 14px;
        }
      }

      .login {
        input[type=text], input[type=password], input[type=submit] {
          padding: 6px 10px;
          border: 1px solid #616161;
          border-radius: 1px;
          font-family: inherit;
          font-size: 14px;
          background-color: white;
          transition: all .2s ease-in-out;

          &:hover {
            border: 1px solid #3e3e3e;
          }

          &:focus {
            border: 1px solid #212121;
          }

          &.error {
            border: 1px solid #e53e3e;
          }
        }

        .login-field-set {
          width: 172px;
          margin-left: 25px;
          display: inline-block;
          position: relative;

          .eye-icon {
            position: absolute;
            right: 5px;
            top: 7px;
            z-index: 2;
            cursor: pointer;
          }

          input[type=password], .eye-icon + input {
            width: 172px;
            padding-right: 30px;
          }

          .error-message {
            position: absolute;
            top: 36px;
            left: 0;
          }
        }

        input[type=text], input[type=password] {
          width: 172px;
        }

        input[type=submit] {
          margin-left: 25px;
          font-weight: 600;
          padding: 6px 20px;
          height: 33px;

          &:hover {
            background-color: #f9f9f9;
          }

          &:focus {
            background-color: #eee;
          }
        }
      }
    }
  }

  .content {
    flex-grow: 1;

    .content-wrapper {
      display: flex;
      min-width: 900px;
      max-width: 1200px;
      margin: 60px auto 40px auto;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;

      .book-illustration {
        width: 600px;
        height: 400px;
      }

      .register {
        h3 {
          font-family: 'Merriweather', serif;
          font-weight: bold;
          font-size: 19px;
          margin-bottom: 25px;
        }

        .registerForm {
          display: flex;
          flex-direction: column;
          width: 322px;

          label, input {
            width: 322px;
          }

          label {
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 15px;
          }

          input[type=password].register-password {
            width: 322px;
          }

          input[type=text], input[type=password], input[type=submit] {
            padding: 10px;
            border: 1px solid #616161;
            border-radius: 1px;
            font-family: inherit;
            font-size: 14px;
            background-color: white;
            transition: all .2s ease-in-out;

            &:hover {
              border: 1px solid #3e3e3e;
            }

            &:focus {
              border: 1px solid #212121;
            }

            &.error {
              border: 1px solid #e53e3e;
            }
          }

          input[type=submit] {
            font-weight: 600;
            padding: 0;
            border: 0;
            width: 80px;
            height: 32px;
            background-color: #F8CC19;
            box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.15);
            align-self: flex-end;

            &:hover {
              border: 0;
              box-shadow: 0px 1px 4px 1px rgba(0,0,0,0.25);
            }

            &:focus {
              border: 0;
            }
          }

          fieldset {
            width: 300px;
            display: inline-block;
            position: relative;
            margin-bottom: 20px;

            .eye-icon {
              position: absolute;
              right: 8px;
              top: 10px;
              z-index: 2;
              cursor: pointer;
            }

            .error-message {
              margin-top: 5px;
            }

            input[type=password], .eye-icon + input {
              width: 280px;
              padding-right: 30px;
            }
          }
        }
      }
    }
  }

  footer {
    background-color: #FCF8E7;
    width: 100%;
    padding-top: 60px;
    padding-bottom: 60px;

    .footer-container {
      font-size: 14px;
      line-height: 1.25;
      display: flex;
      justify-content: space-between;
      width: 1000px;
      margin-left: auto;
      margin-right: auto;

      section {
        width: 28%;

        .footer-header {
          display: flex;

          .book-svg {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }

          h3 {
            font-size: 16px;
            font-family: 'Merriweather', serif;
            margin-bottom: 15px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .error {
    border: 1px solid #e53e3e;
  }

  .error-message {
    font-size: 11px;
    color: #e53e3e;
    width: 100%;
  }
}

</style>
