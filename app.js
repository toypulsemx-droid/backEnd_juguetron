const express = require('express')
const cors = require('cors')
const cloudRoutes = require('./Routes/routesCloud');


const clipPagoRoutes= require('./Routes/routesClip')

const app = express()


app.use(cors())
app.use(express.json())

app.use('/api', clipPagoRoutes)
app.use('/api', cloudRoutes);



module.exports = app