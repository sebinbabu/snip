const { SnipModel } = require('../models');

function setSnip(req, res, next) {
  const { snipname, ...snip } = req.body;
  const random = new Date()
    .getTime()
    .toString(36)
    .substr(-6);
  const snipKey = req.params.snipname || random;
  SnipModel.setSnip(snipKey, snip)
    .then(() => {
      res.json({
        snipname: snipKey,
        message: 'success',
        status: 200,
      });
    })
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
