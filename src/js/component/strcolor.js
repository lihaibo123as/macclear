module.exports = {
    data: function () {
        return {
            fixstr: '',
            // color: 'danger',
        }
    },
    computed: {
    },
    methods: {
        parse: function () {
            if (this.text && this.search && this.text.indexOf(this.search) > -1) {
                var color = this.colorStyle();
                var str = this.text.replace(this.search, color);
                this.fixstr = str;
                return;
            }
            this.fixstr = this.text;
        },
        colorStyle: function () {
            return ('<b style="text-decoration: underline;" class="text-' + (this.color ? this.color : 'success') + '">' + this.search + '</b>');
        }
    },
    props: {
        search: String,
        text: String,
        color: {
            type: String,
            validator: function (value) {
                return ['success', 'warning', 'danger', 'info', 'primary'].indexOf(value) !== -1
            }
        },
    },
    //数据监听
    watch: {
        search() {
            this.parse();
        },
        text() {
            this.parse();
        },
        color() {
            this.parse();
        }
    },
    created: function () {
        // console.log('string_color create', this.$data);
    },
    updated: function () {
        // console.log('string_color updated', this);
    },
    beforeMount: function () {
        // console.log('string_color beforeMount', this.color);
        this.parse();
    },
    template: '<span v-html="fixstr"></span>',
}