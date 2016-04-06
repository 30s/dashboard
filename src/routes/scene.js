var express = require('express')
var	router = express.Router()
var	Scene = require('../models/scene.js')
var ApiError = require('../util/api-error')

router.get('/scenes', function (req, res, next) {
  Scene.find(req.query, function (err, devices) {
    if (err && err.statusCode !== 404) return next(err)
    res.json(devices)
  })
})

router.post('/scenes', function (req, res, next) {
  Scene.findOne(req.body, function (err, device) {
    if (err && err.statusCode !== 404) return next(err)

    if (device === undefined) {
      Scene.create(req.body, function (err, item) {
        if (err) return next(err)
        return res.status(204).end()
      })
    } else return next(new ApiError(500, 'This device exists!'))
  })
})

router.patch('/scenes', function (req, res, next) {
  Scene.findOne(req.query, function (err, device) {
    if (err) return next(err)

    Scene.update(req.query, req.body, function (err) {
      if (err) next(err)
      return res.status(204).end()
    })
  })
})

router.delete('/scenes', function (req, res, next) {
  Scene.find(req.query, function (err, devices) {
    if (err) return next(err)

    if (!Object.keys(devices).length) return next(new ApiError(404, 'These resources doesn´t exists!'))
    devices.forEach(function (item) {
      item.destroy(function (err) {
        if (err) return next(err)
        return res.status(204).end()
      })
    })
  })
})

module.exports = router
