module.exports = {
    data: function () {
        return {};
    },
    methods: {
        show: function () {
            this.$emit('update:loading', true);//触发父类属性更新
        },
        hide: function () {
            this.$emit('update:loading', false)
        }
    },
    props: {
        loading: Boolean,
    },
    created: function () {
        // console.log('loading create', this.$data);
    },
    updated: () => {
        // console.log('loading updated', this.$data);
    },
    template: `
    <div class="loading" v-on:click="hide" v-if="loading">
        <div class="loading-bg"></div>
        <div class="loading-icon"><i class="fa fa-spinner fa-pulse"></i></div>
    </div>
    `,
}