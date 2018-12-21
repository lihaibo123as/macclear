    nw.loadCss({content : ".card{backround:red}.card>.head{color:red;background:yellow}"});

    var Vue           = require("vue");
    var listComponent = require('component/list');
    module.exports = Vue.extend({
        data : function() {
            return {
                id      : 23456,
                message : 'Message'
            }
        },
        methods : {
            click : function() {
                console.log("click()");
            }
        },
        components: {
            'list-component' : listComponent
        },
        template : '<div class="app" @click="click"><p>{{a}}</p><list-component :msg="message"></list-component></div>'
    });