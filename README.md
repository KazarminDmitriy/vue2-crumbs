# vue2-crumbs

Breadcrumbs plugin for Vue.js 2 allows you to customize breadcrumbs just the way you want

##### Features:
- Setting parent route without need to actually nest it in children array
- [Setting label or i18n alias](#label-or-i18n-alias) in route
- [Specifying a parameter from the url address](#specifying-a-parameter-from-the-url-address) in the label or i18n
- [Define crumbs info in page component](#define-crumbs-info-in-page-component)
- [Dynamic crumbs](#dynamic-crumbs)

## Installation

```sh
$ npm install @phoenix91/vue2-crumbs --save
```

```js
import Vue from 'vue'
import Crumbs2 from '@phoenix91/vue2-crumbs';

Vue.use(Crumbs2);
```

After installation <crumbs /> component will become available for use

## Usage

Use the `crumbs` property in route's `meta` to provide route label or/and parent route `name` as in example below:

### Simple Example
```js
new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        crumbs: {
          label: 'Home',
          parent: '',
        },
      },
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts,
      meta: {
        crumbs: {
          label: 'Posts',
          parent: 'home',
        }
      }
    },
  ],
});
```

### Component properties

The component vue2-crumbs has many options for customization

| Name           | Type    | Default |
|----------------|---------|---------|
| showHome       | Boolean | true    |
| showLast       | Boolean | true    |
| lastItemIsLink | Boolean | false   |
| navClass       | String  | ''      |
| listClass      | String  | ''      |
| itemClass      | String  | ''      |
| linkClass      | String  | ''      |
| lastItemClass  | String  | ''      |

The HTML template of crumbs has the next structure

```text
nav > ul > li > (a || span)
```

### Label or i18n alias

If you have a multilingual application, then you can also specify i18n alias as crumb label. I18n is a higher priority property than the label

#### Example:
```js
new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        crumbs: {
          i18n: 'home',
          parent: '',
        },
      },
    },
  ],
});
```

If you use i18n then you need to use the library [vue-i18n](https://github.com/kazupon/vue-i18n)

### Specifying a parameter from the url address

If in crumb you need to specify a parameter from the url address, then you can specify it directly in the label or in the translation of the i18n alias

#### Example:
```js
new VueRouter({
  routes: [
    {
      path: '/posts/:post_id(\\d+)',
      name: 'post_view',
      component: PostView,
      meta: {
        crumbs: {
          label: 'Post #:post_id',
          // or
          // i18n: 'view_post', // where decryption of view_post is "Post #:post_id" 
          parent: 'posts',
        }
      }
    },
  ],
});
```

### Define crumbs info in page component

You can define crumbs in page components. This would overwrite data in the router. In crumbs you can return both an object and an array of objects

#### Example:
```js
export default {
  crumbs() {
    return [
      {
        label: 'Posts',
        name: 'posts',
      },
      {
        label: 'Post',
        name: 'post',
      },
    ];
  },
};
```

### Dynamic crumbs

Sometimes in crumb needs dynamic information or information from the backend. In page components in crumbs you can define it

#### Example:
```js
export default {
  crumbs() {
    return [
      {
        label: 'Post "' + this.oPost.name + '"',
        name: 'post',
      },
    ];
  },
};
```

Attention! If you define crumbs in a page component, then you need to call function __this.changeCrumbs();__
This is necessary in order for the computed values to be applied (for example, getting the post from the backend). You can call it both in created() and in the function to get information from the backend

#### Example:
```js
export default {
  crumbs() {
    return [
      {
        label: 'Post "' + this.oPost.name + '"',
        name: 'post',
      },
    ];
  },
  created() {
    // some actions
    this.changeCrumbs();
  },
  // or
  methods: {
    getPost() {
      axios.get('/api/posts/1')
        .then((response) => {
          this.oPost = response.data;

          this.changeCrumbs();
        });
    },
  },
};
```

# License

[MIT](http://opensource.org/licenses/MIT)