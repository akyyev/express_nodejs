const e = require('express');
const express = require('express');
const { func } = require('joi');
const app = express();
const Joi = require('joi')
app.use(express.json())


const courses = [
    {id:1, name: 'Math'},
    {id:2, name: 'JAVA'},
    {id:3, name: 'JS'},
    {id:4, name: 'Python'}
]

// app.post()
// app.put()
// app.delete()
app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.get('/api/courses', (req, res)=>{
    res.send(courses)
})

app.get('/api/courses/:id', (req, res)=>{
    // res.send(req.params.id)

    //This will find matching course to given id
    const course = courses.find(c=> c.id === parseInt(req.params.id))
    if(!course) // 404 
    {
        res.status(404).send('The course with the given id was not found!')
    } 
    else 
    {
        res.send(course)
    }

})


// let's create a course by using post request
app.post('/api/courses', (req, res)=>{
    //Input validation for name
    // Bad request
    // if(!req.body.name || req.body.name.length<3){
    //     res.status(400).send('Name is required and should be minimum 3 charachters!')
    //     return;
    // }
    
    // Here is easier way of validating name using Joi npm library
    // Inorder to use joi we need schema
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(10)
            .required()
    })

    const result = schema.validate({name: req.body.name})

    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }

    // This is new id for newly created course
    let max_id = 0
    courses.forEach(c=>{
        if(c.id>max_id) max_id = c.id
    })

    const course = {
        id: max_id+1,
        // inorder this work we need to use express.json --> line 6
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})

// let's update a course by using put request
app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c=>c.id=== parseInt(req.params.id))
    if(!course) {
        res.status(404).send('The course with the given id was not found!')
        return;
    }
    //const result = validateName(req.body.name);
    const {error} = validateName(req.body.name) // object destructuring => result.error
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }

    course.name = req.body.name

    res.send(course)
})


app.delete('/api/courses/:id', (req, res)=>{
    const course = courses.find(c=>c.id=== parseInt(req.params.id))
    if(!course) {
        res.status(404).send('The course with the given id was not found!')
        return;
    }

    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    //return the same course
    res.send(course)


})


// all params
app.get('/api/courses/:year/:month', (req, res)=>{
    res.send(req.params)
    // res.send(req.query)
})




// Environment Variable POST
// How to set new port: export PORT=Value
const port = process.env.PORT || 3000

// creating server, run: node index.js
                    // : nodemon index.js 
app.listen(port, ()=>{
    console.log(`listening port ${port}`);
})






// This is validation for name property of a course

function validateName(theName){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(10)
            .required()
    })

    return schema.validate({name: theName})
}