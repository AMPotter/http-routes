const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = chai;
chai.use(chaiHttp);
const app = require('../lib/app');
const client = require('../lib/db-client');

describe('cupcakes API', () => {

    beforeEach(() => client.query('DELETE FROM cupcakes'));

    let chocolateCupcake = {
        name: 'chocolate cupcake',
        category_id: 1,
        color: 'brown',
        description: 'an overrated classic'
    };

    let meatloafCupcake = {
        name: 'meatloaf cupcake',
        category_id: 2,
        color: 'red/grey',
        description: 'more surface area for crispy outer layer, the best part'
    };

    function save(cupcake) {
        return chai.request(app)
            .post('/cupcakes')
            .send(cupcake)
            .then(({ body }) => {
                cupcake.id = body.id;
                assert.deepEqual(body, cupcake);
            });
    }

    beforeEach(() => {
        return save(meatloafCupcake);
    });

    beforeEach(() => {
        return save(chocolateCupcake);
    });

    it('saves a cupcake', () => {
        assert.ok(meatloafCupcake.id);
    });

    it('updates a cupcake', () => {
        meatloafCupcake.color = 'extra red, extra sauce';
        return chai.request(app)
            .put(`/cupcakes/${meatloafCupcake.id}`)
            .send(meatloafCupcake)
            .then(({ body }) => {
                assert.equal(body.color, 'extra red, extra sauce');
            });
    });

    it('updates only cupcake being updated', () => {
        meatloafCupcake.color = 'extra red';
        return chai.request(app)
            .put(`/cupcakes/${meatloafCupcake.id}`)
            .send(meatloafCupcake)
            .then(() => chai.request(app).get('/cupcakes'))
            .then(({ body }) => {
                body.sort((a, b) => a.id - b.id);
                assert.deepEqual(body, [meatloafCupcake, chocolateCupcake]);
            });
    });

    it('GET cupcake by id', () => {
        return chai.request(app)
            .get(`/cupcakes/${meatloafCupcake.id}`)
            .then(({ body }) => {
                assert.deepEqual(body, meatloafCupcake);
            });
    });

    it('GET cupcakes', () => {
        return chai.request(app)
            .get('/cupcakes')
            .then(({ body }) => {
                assert.deepEqual(body, [meatloafCupcake, chocolateCupcake]);
            });
    });

    it('DELETE cupcake', () => {
        return chai.request(app)
            .del(`/cupcakes/${meatloafCupcake.id}`)
            .then(() => {
                return chai.request(app)
                    .get(`/cupcakes/${meatloafCupcake.id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
});