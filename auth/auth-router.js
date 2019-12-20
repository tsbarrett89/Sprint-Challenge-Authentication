const bcrypt = require('bcryptjs')

const router = require('express').Router()

const db = require('../database/dbConfig.js')

router.post('/register', (req, res) => {
  const creds = req.body

  if (creds.username && creds.password) {
    const hash = bcrypt.hashSync(creds.password, 14)
    creds.password = hash

    db('users').insert(creds)
    .then(yes => res.status(201).json(yes))
    .catch(err => res.status(500).json({errMsg: 'error registering user'}))
  } else {
    res.status(404).json({errMsg: "username and password are required"})
  }
});

router.post('/login', (req, res) => {
  const creds = req.body

  db('users').where({username: creds.username}).first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.name = user.username
        res.status(200).json({msg: "Login successful", username: user.username})
      } else {
        res.status(401).json({msg: "Invalid credentials"})
      }
    })
    .catch(err => {
      res.status(500).json({errMsg: "error validating user"})
    })
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out')
      } else {
        res.send('user logged out')
      }
    })
  }
})

module.exports = router;