

const path = require("path");

const {VueLoaderPlugin} = require('vue-loader');


module.exports ={
    mode : 'development',
    watch : true,
    entry : {
        'app' : "./src/app.js",
    },
    output : {
        path : path.resolve(__dirname, "public")
    },
    module : {
        rules : [{
            test : /\.vue$/,
            loader : 'vue-loader'
        },
        {
            test : /\.js$/,
            exclude : /node_modules/,
            use: {
                loader: "babel-loader",
              }
        }
    ]
    },
    plugins : [
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ["*", ".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
        }
    },
}