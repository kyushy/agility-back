const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
const mongoose = require('mongoose'); 

const port = process.env.PORT || 3030

const urlmongo = `mongodb+srv://${process.env.DB_USER}:${DB_PASSWORD}@engitdb-hwjyk.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(urlmongo);

//Mongo Connection
const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
}); 

//Mongo Schema
var sessionSchema = mongoose.Schema({
    name: String, 
    template: String, 
    open: Boolean  
}); 
var Session = mongoose.model('sessions', sessionSchema);

var resultSchema = mongoose.Schema({
    name: String,
    responses: Array 
});
var Result = mongoose.model('responses', resultSchema)


//CORS and routes
var router = express.Router();

router.route('/sessions')
.get(function(req,res){ 
	Session.find(function(err, sessions){
        if (err){
            res.send(err)
        }
        res.json(sessions)
    })
})
.post(function(req,res){
    let session = new Session()
    console.log(req)
    session.name = req.body.id
    session.template = req.body.template
    session.open = true
    session.save(function(err){
        if(err) {
            res.send(err)
        }
        res.json({msg: 'Session created'})
    })
})    

router.route('/sessions/:session_id')
.get(function(req,res){ 
    Session.findOne({name: req.params.session_id}, function(err, session) {
        if (err) {
            res.send(err)
        }
        res.json(session)
    });
})
.put(function(req,res){
    Session.findOne({name: req.params.session_id}, function(err, session) {
        if (err) {
            res.send(err)
        }
        session.open = req.body.open
        session.save(function(err){
            if(err) {
                res.send(err)
            }
            res.json({msg: 'Session updated'})
        })
    });
})

router.route('/results/:session_id')
.get(function(req,res){ 
	Result.find({name: req.params.session_id}, function(err, results){
        if (err){
            res.send(err)
        }
        res.json(results)
    })
})

router.route('/results')
.post(function(req,res){
    let result = new Result()
    result.name = req.body.id
    result.responses = req.body.responses
    result.save(function(err){
        if(err) {
            res.send(err)
        }
        res.json({msg: 'Result created'})
    })
})    


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router)

app.listen(port, () => console.log('server started on port', port))
