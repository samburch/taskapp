const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: "Sam Burch",
            email: "something@example.com",
            password: "dsaifnewonf134"
        }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response. Check whether the name is correct and a user token exists
    expect(response.body).toMatchObject({
        user: {
            name: 'Sam',
            email: 'sam.burch@example.com'
        },
        token: user.tokens[0].token
    })
    // Expect the userpassword to be hashed and not equal to input
    expect(user.password).not.toBe('dsaifnewonf134')
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })

    // Another way
    //    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login noexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'notauser@nothing.com',
        password: 'notauser123!'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticaed user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/user/me')
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert that the user no longer exists and is deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
    
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/user/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/reflect.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Sam'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Sam')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Dorking'
        })
        .expect(400)

})

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticate