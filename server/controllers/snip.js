const { SnipModel } = require('../models');

function setSnip(req, res, next) {
  const { snipname, ...snip } = req.body;
  const snipKey = req.params.snipname;
  SnipModel.setSnip(snipKey, snip)
    .then(doc => res.json(doc))
    .catch(error => next(error));
}

function getSnip(req, res, next) {
  const { snipname } = req.params;
  SnipModel.getSnip(snipname, {
    _id: false,
    deleted: false,
  })
    .then(doc => res.json(doc))
    .catch(error => next(error));
}

module.exports = {
  getSnip,
  setSnip,
};
