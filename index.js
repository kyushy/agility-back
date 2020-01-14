const express = require('express')
const app = express()

app.get('/section/:id', (req, res) => {
    if(req.params.id === 'poc')
        res.status(200)
    else
        res.status(403)
})

app.listen(3000, () => console.log('server started'))
