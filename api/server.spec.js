const supertest = require('supertest');

const server = require('./server');

const db = require('../database/dbConfig');

beforeEach(() => {
    return db.migrate.rollback().then(()=>db.migrate.latest()).then(()=>db.seed.run());
});

describe('server', () => {
    it('should run tests', () => {
        expect(true).toBeTruthy()
    })

    describe('POST /api/auth/register', () => {
        it('should return http status code 201', async() => {
            const res = await supertest(server)
                .post('/api/auth/register')
                .send({ username: "NewUser", password: "password" })
            
            expect(res.status).toBe(201)
        })

        it('should have a token', async() => {
            const res = await supertest(server)
                .post('/api/auth/register')
                .send({ username: "NewUser", password: "password" })

            expect(res.body.data.id).toBeDefined()
        })
    })

    describe('POST /api/auth/login', () => {
        it('should return http status code 200', async() => {
            const res = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'user', password: 'password' })
            
            expect(res.status).toBe(200)
        })

        it('should have token', async() => {
            const res = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'user', password: 'password' })

            expect(res.body.token).toBeDefined()
        })
    })

    describe('GET /api/jokes', () => {
        it('should return http status code 400 if not logged in', async() => {
            const res = await supertest(server)
                .get('/api/jokes')

            expect(res.status).toBe(400)
        })

        it('should return http status code 200 if logged in', async() => {
            const loggedIn = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'user', password: 'password' });

            const res = await supertest(server)
                .get('/api/jokes')
                .set('authorization', loggedIn.body.token)

            expect(res.status).toBe(200)
        })
    })
})