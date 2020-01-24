import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Landing from '../views/Landing.vue';
import Book from '../views/Book.vue';
import Genres from '../views/Genres.vue';
import Authors from '../views/Authors.vue';
import NotFound from '../views/404.vue';
import Profile from '../views/Profile.vue';
import Search from '../views/Search.vue';
import Admin from '../views/Admin/Admin.vue';
import AdminHome from '../views/Admin/AdminHome.vue';
import AdminBooks from '../views/Admin/AdminBooks.vue';
import AdminEditBook from '../views/Admin/AdminEditBook.vue';
import AdminCreateBook from '../views/Admin/AdminCreateBook.vue';
import AdminEditGenre from '../views/Admin/AdminEditGenre.vue';
import AdminCreateGenre from '../views/Admin/AdminCreateGenre.vue';
import AdminEditAuthor from '../views/Admin/AdminEditAuthor.vue';
import AdminCreateAuthor from '../views/Admin/AdminCreateAuthor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/book/:id',
    name: 'book',
    component: Book,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/genres',
    name: 'genres',
    component: Genres,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/authors',
    name: 'authors',
    component: Authors,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/search/:query',
    name: 'search',
    component: Search,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // Login & Register Page
    path: '/landing',
    name: 'landing',
    component: Landing,
    meta: {
      guest: true,
    },
  },
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      admin: true,
    },
    children: [
      {
        path: '',
        name: 'adminhome',
        component: AdminHome,
      },
      {
        path: 'books',
        name: 'adminbooks',
        component: AdminBooks,
      },
      {
        path: 'edit/book/:bookID',
        name: 'editbook',
        component: AdminEditBook,
      },
      {
        path: 'create/book',
        name: 'createbook',
        component: AdminCreateBook,
      },
      {
        path: 'edit/genre/:genreID',
        name: 'editgenre',
        component: AdminEditGenre,
      },
      {
        path: 'create/genre',
        name: 'creategenre',
        component: AdminCreateGenre,
      },
      {
        path: 'edit/author/:authorID',
        name: 'editauthor',
        component: AdminEditAuthor,
      },
      {
        path: 'create/author',
        name: 'createauthor',
        component: AdminCreateAuthor,
      },
    ],
  },
  {
    path: '*',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.cookie.get('token')) {
      next({ name: 'landing' });
    } else if (to.matched.some(record => record.meta.admin)) {
      Vue.prototype.$http.get('auth/is_admin', { headers: { Authorization: Vue.cookie.get('token') } })
        .then(() => {
          next();
        })
        .catch(() => {
          next({ name: 'home' });
        });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!Vue.cookie.get('token')) {
      next();
    } else {
      next({ name: 'home' });
    }
  } else {
    next();
  }
});

export default router;
