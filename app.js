let express = require(`express`);
let app = express();
let env = require(`dotenv`);
env.config();
let port=process.env.PORT || 9800;


let cors = require(`cors`);
let mongo = require(`mongodb`);
let  mongoClient = mongo.MongoClient;
let mongoUrl = "mongodb+srv://Admin:pass123@cluster0.jcbz5t0.mongodb.net/Tanishqdb?retryWrites=true&w=majority"
let bodyParser = require('body-parser');
let db;

//middleware

// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Origin');
    res.header('Access-Control-Allow-Headers', 'Accept');
    res.header('Access-Control-Allow-Methods', 'Post');
    res.header('Access-Control-Allow-Methods', 'Options');
    next();
  });

app.get('/',(req,res) => {
    res.send('This is From Express App code')
})

app.get('/topstrip',(req,res) => {
    db.collection('topstrip').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/category',(req,res) => {
    db.collection('category').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/gender',(req,res) => {
    db.collection('gender').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/shop/jewllery',(req,res) => {
    let query={};
    let category_id =Number(req.query.category_id) ;
    if(category_id ){
        query={"category_id":category_id }
    }
    db.collection('jwellList').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/shop/gender',(req,res) => {
    let query={};
    let gender_id =Number(req.query.gender_id) ;
    if(gender_id ){
        query={"gender_id":gender_id }
    }
    db.collection('jwellList').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/filtercategory/:category_id',(req,res) => {
    let query = {};
    let sort = {"new_price":1}
    let category_id= Number(req.params.category_id);
    query={"category_id":category_id};
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    if(req.query.sort){
        sort={"new_price":req.query.sort}
    }
    if(lcost && hcost){
        query={
            "category_id":category_id,
            
            $and:[{new_price:{$gt:lcost,$lt:hcost}}]
        }
    }
 
    
    db.collection('jwellList').find(query).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/filtergender/:gender_id',(req,res) => {
    let query = {};
    let sort = {"new_price":1}
    let gender_id= Number(req.params.gender_id);
    query={"gender_id":gender_id};
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    if(req.query.sort){
        sort={"new_price":req.query.sort}
    }
    if(lcost && hcost){
        query={
            "gender_id":gender_id,
            
            $and:[{new_price:{$gt:lcost,$lt:hcost}}]
        }
    }
 
    
    db.collection('jwellList').find(query).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//page 3
app.get('/proddetail/rings',(req,res) => {
    let query={};
    let item_id =Number(req.query.item_id) ;
    if(item_id ){
        query={"item_id":item_id }
    }
    db.collection('rings').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/proddetail/coins',(req,res) => {
    let query={};
    let item_id =Number(req.query.item_id) ;
    if(item_id ){
        query={"item_id":item_id }
    }
    db.collection('coins').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/proddetail/earrings',(req,res) => {
    let query={};
    let item_id =Number(req.query.item_id) ;
    if(item_id ){
        query={"item_id":item_id }
    }
    db.collection('earring').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/proddetail/pendents',(req,res) => {
    let query={};
    let item_id =Number(req.query.item_id) ;
    if(item_id ){
        query={"item_id":item_id }
    }
    db.collection('pendants').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//add to cart
app.post('/cart',(req,res) => {
    console.log(req.body);
    db.collection('cart').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('added to cart')
    })
})

// show orders

app.get('/orders',(req,res) => {
    db.collection('cart').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.delete('/deleteOrder/:id',(req,res) => {
    let item_id= Number(req.params.id);
    // let item_id = mongo.ObjectId(req.params.id);
    db.collection('cart').deleteOne({item_id},(err,result) => {
        if(err) throw err;
        res.send('Order Deleted')
    })
})

//5thpAGE
//orderplaced
//email, ordersummery, delivery details
app.post('/orderplaced',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('added to cart')
    })
})





//connection with mongo
mongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log(`Error while connecting`);
    db = client.db('Tanishqdb')
    app.listen(port,() => {
        console.log(`Listing to port ${port}`)
    })
})