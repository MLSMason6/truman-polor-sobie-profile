const express = require('express')
const app = express()
const port = process.env.PORT || 3000;


// endpoint, middleware(s)
app.get('/', function (req, res) {
  res.send('Hello Express')
})

app.listen(port, ()=> console.log(`server is running on ... ${port}`));

