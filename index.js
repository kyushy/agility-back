const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000


app.use(cors())

app.get('/section/:id', (req, res) => {
    if(req.params.id === 'poc')
        res.status(200).json({ access: 'ok', template: 'base' })
    else
        res.status(200).json({ access: 'denied' })
})

app.listen(port, () => console.log('server started on port', port))
