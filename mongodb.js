// CRUD - Create, Read, Update, Delete operations

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = process.env.MONGO_DB
const databaseName = 'task-manager'

// Mongo client connection
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log("Unable to connect to database!")
    }

    const db = client.db(databaseName)

    // db.collection('users').findOne({ _id:  new ObjectID("62d1b08ad89527c18bb88482") }, (error, user) => {
    //     if (error) {
    //         return console.log("Unable to fetch user")
    //     }

    //     console.log(user)
    // })

    // db.collection('users').find({ age: 36 }).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({ age: 36 }).count((error, count) => {
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("62d1b5ca09cd4ed14fcf04eb") }, (error, user) => {
    //     if(error) {
    //         return 'unable to fetch'
    //     }

    //     console.log(user)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     console.log(tasks)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("62d1b426f60399a2ede4a3ed")
    // }, {
    //     // $set: {
    //     //     name: 'Micheal'
    //     // }
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age: 36
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: "Complete this node course"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})