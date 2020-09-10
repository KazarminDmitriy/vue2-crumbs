<template>
    <nav :class="navClass">
        <ul :class="listClass">
            <template v-for="(oCrumb, index) in arPreparedCrumbs">
                <!-- The main page is displayed apart -->
                <template v-if="oCrumb.isHome">
                    <li :class="itemClass" v-if="showHome">
                        <router-link :to="oCrumb.path" :class="linkClass">
                            {{ oCrumb.label }}
                        </router-link>
                    </li>
                </template>

                <!-- Crumbs in the middle -->
                <template v-else-if="index < arCrumbs.length - 1">
                    <li :class="itemClass">
                        <router-link :to="oCrumb.path" :class="linkClass">
                            {{ oCrumb.label }}
                        </router-link>
                    </li>
                </template>

                <!-- Last crumb is displayed apart -->
                <template v-else-if="showLast">
                    <li :class="[itemClass, lastItemClass]">
                        <template v-if="lastItemIsLink">
                            <router-link :to="oCrumb.path" :class="linkClass">
                                {{ oCrumb.label }}
                            </router-link>
                        </template>
                        <template v-else>
                            <span :class="linkClass">{{ oCrumb.label }}</span>
                        </template>
                    </li>
                </template>
            </template>
        </ul>
    </nav>
</template>

<script>
    import get from 'lodash.get';
    import isObject from 'lodash.isobject';

    export default {
        props: {
            showHome: {
                type: Boolean,
                default: true,
            },
            showLast: {
                type: Boolean,
                default: true,
            },
            navClass: {
                type: String,
                default: '',
            },
            listClass: {
                type: String,
                default: '',
            },
            itemClass: {
                type: String,
                default: '',
            },
            linkClass: {
                type: String,
                default: '',
            },
            lastItemClass: {
                type: String,
                default: '',
            },
            lastItemIsLink: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                arCrumbs: [],
            };
        },
        computed: {
            arPreparedCrumbs() {
                return this.arCrumbs.filter((oCrumb) => {
                    return this.labelExist(oCrumb);
                });
            },
        },
        created() {
            this.processCrumbs(this.$route);

            this.$router.afterEach((to) => {
                this.arCrumbs = [];

                this.processCrumbs(to);
            });

            this.$crumbsEventBus.$on('crumbsChanged', this.crumbsChanged);
        },
        methods: {
            processCrumbs(oCurrentRoute) {
                this.arCrumbs.push(this.prepareCrumbFromRoute(oCurrentRoute));

                this.processAncestorsRoutes(oCurrentRoute);

                this.arCrumbs.forEach((oCrumb, i) => {
                    for (const sParamName in oCrumb.params) {
                        this.arCrumbs[i].label = oCrumb.label.replace(':' + sParamName, oCrumb.params[sParamName]);
                    }
                });
            },
            processAncestorsRoutes(oRoute) {
                const sParentName = get(oRoute, 'meta.crumbs.parent', null);

                if (sParentName === null || sParentName === '') {
                    return;
                }

                const routeResolveObject = {
                    name: sParentName,
                };

                const oParentRoute = this.$router.resolve(routeResolveObject).route;

                if (oParentRoute.matched.length !== 0) {
                    this.arCrumbs.unshift(this.prepareCrumbFromRoute(oParentRoute));

                    this.processAncestorsRoutes(oParentRoute);
                }
            },
            prepareCrumbFromRoute(oRoute) {
                let label = '';

                if (get(oRoute, 'meta.crumbs.i18n', null)) {
                    label = this.$t(oRoute.meta.crumbs.i18n);
                }
                else if (get(oRoute, 'meta.crumbs.label', null)) {
                    label = oRoute.meta.crumbs.label;
                }

                return {
                    name: oRoute.name,
                    path: oRoute.path,
                    label: label,
                    parent: get(oRoute, 'meta.crumbs.parent', null),
                    params: oRoute.params,
                    isHome: oRoute.path === '/',
                };
            },

            crumbsChanged(_this) {
                const mCustomCrumbs = _this.$options.crumbs.call(_this);

                if (Array.isArray(mCustomCrumbs)) {
                    mCustomCrumbs.forEach((oCustomCrumb) => {
                        this.updateCrumb(oCustomCrumb);
                    });
                }
                else if (isObject(mCustomCrumbs)) {
                    this.updateCrumb(mCustomCrumbs);
                }
            },
            updateCrumb(oCustomCrumb) {
                this.arCrumbs.forEach((oCrumb) => {
                    if (oCrumb.name === oCustomCrumb.name) {
                        oCrumb.label = oCustomCrumb.label;
                    }
                });
            },

            labelExist(oCrumb) {
                return get(oCrumb, 'label', '') !== '';
            },
        },
    };
</script>
