var array = [
    require('./buildIE8'),
]
Promise.all(array).then(function() {
    console.log('build complete!!!')
}).catch(function() {
    console.log('build error!!!')
})