const express= require('express');
const app=express();
const port=8000;

const expressLayouts=require('express-ejs-layouts');
// use layouts
app.use(expressLayouts);
//  use routes
app.use('/',require('./routes'));
// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`server is running on port:${port}`);
})