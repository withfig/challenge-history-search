// https://github.com/vuejs/vue-cli/issues/1132#issuecomment-409916879
module.exports = {
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config
                .output
                .filename('[name].[hash].js')
                .end()
        }
    }
}
