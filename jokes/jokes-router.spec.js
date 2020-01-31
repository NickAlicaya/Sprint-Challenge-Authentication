const server = require("../api/server.js");
const request = require("supertest");
const restricted = require('../auth/authenticate-middleware.js');
const db = require('../database/dbConfig.js');



describe("jokes router", () => {
  it("should return status 401 without auth", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.status).toBe(401);
  });

  it("should be a json response", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.type).toBe("application/json");
  });
})

describe("when doing GET /api/jokes", () =>{
    beforeEach(async() => {
        await db('users')
        .truncate
    })
    it('should allow authenticated users to view jokes in json', async() => {
        //user then registers
        const response = await request(server).post('/api/auth/register')
        .send({username: 'nick4', password: 'pass4'})
        
        //user logs in
        const loginResponse = await request(server).post('/api/auth/login')
        .send({ username: 'nick4', password: 'pass4' })
        .expect('Content-Type', /json/)

        //server responds with jokes in json format
        const dadJokes = await request(server).get('/api/jokes')
        .auth('nick4', 'pass4')
        .set('Authorization', loginResponse.body.token)
        .expect('Content-Type', /json/)
    })
})