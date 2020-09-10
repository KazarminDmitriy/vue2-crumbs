import Crumbs from './Crumbs';

export default {
    install: (Vue) => {
        Vue.prototype.$crumbsEventBus = new Vue();

        Vue.component('crumbs', Crumbs);

        Vue.mixin({
            methods: {
                changeCrumbs() {
                    this.$crumbsEventBus.$emit('crumbsChanged', this);
                },
            },
        });
    },
};
