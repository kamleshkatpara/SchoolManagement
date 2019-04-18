const express = require('express')
const request = require('request')

// Create express router
const router = express.Router()

// API Constant //

const API_URL = 'http://localhost:3000/api'

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

const allowCrossDomain = function(req, res, next) {
  const allowOrigin =
    envConfig[envConfig.environmentName].allowOrigin ||
    req.headers.origin ||
    '*'
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authentication, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.header('Pragma', 'no-cache')
  if (req.method === 'OPTIONS') {
    res.status(200).send()
  } else {
    next()
  }
}
app.use(allowCrossDomain)

// Add POST - /api/register
router.post('/register', (req, res) => {
  request.post(
    {
      url: `${API_URL}/users/`,
      form: {
        fullName: req.body.fullName,
        username: req.body.mobileNumber,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        realm: 'User',
        referalCodeUsed: req.body.referalCodeUsed,
        password: req.body.password
      }
    },
    function(response, body) {
      if (JSON.parse(body).error == null) {
        return res.json({ mobileNumber: JSON.parse(body).mobileNumber })
      } else if (JSON.parse(body).error != null) {
        return res.status(401).json({ error: JSON.parse(body).error.code })
      }
    }
  )
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  request.post(
    {
      url: `${API_URL}/users/login?include=user`,
      form: { username: req.body.username, password: req.body.password }
    },
    function(error, response, body) {
      if (JSON.parse(body).id) {
        req.session.authTokenId = { tokenid: JSON.parse(body).id }
        req.session.authUserId = { userid: JSON.parse(body).userId }
        req.session.authUser = { user: JSON.parse(body).user }
        return res.json({
          tokenid: JSON.parse(body).id,
          userid: JSON.parse(body).userId,
          user: JSON.parse(body).user
        })
      } else if (JSON.parse(body).error.code) {
        return res.status(401).json({
          code: JSON.parse(body).error.code,
          statusCode: JSON.parse(body).error.statusCode
        })
      }
    }
  )
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  request.post(
    {
      url: `${API_URL}/users/logout?access_token=` + req.body.token
    },
    function(error, response, body) {
      if (res.status(200)) {
        res.status(200).clearCookie('connect.sid', {
          path: '/'
        })
        res.json({ status: 'User Logged Out Successfully' })
      }
    }
  )
})

// Add GET - /api/user
router.get('/user', (req, res) => {
  request.get(
    {
      url:
        `${API_URL}/users/` +
        req.session.authUserId.userid +
        `?access_token=` +
        req.session.authTokenId.tokenid
    },
    function(error, response, body) {
      if (res.status(200)) {
        return res.json({ user: JSON.parse(body) })
      }
      return res.status(401).json({ fetcherror: 'Error fetching user info' })
    }
  )
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router
}
