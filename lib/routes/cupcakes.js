const Cupcake = require('../models/cupcake');
const notFound = require('./not-found');

const get = (req, res) => {
    if(req.id) {
        Cupcake.selectOne(req.id)
            .then(cupcake => {
                if(!cupcake) notFound(req, res);
                else res.send(cupcake);
            });
    }
    else {
        Cupcake.selectAll()
            .then(cupcakes => res.send(cupcakes));
    }
};

const post = (req, res) => {
    Cupcake.insert(req.body)
        .then(cupcake => res.send(cupcake));
};

const put = (req, res) => {
    Cupcake.update(req.body)
        .then(cupcake => res.send(cupcake));
};

const del = (req, res) => {
    Cupcake.delete(req.id)
        .then(() => res.send({ removed: true }));
};

const methods = { get, post, put, delete: del };

module.exports = (req, res) => {
    const method = methods[req.method.toLowerCase()] || notFound;
    method(req, res);
};