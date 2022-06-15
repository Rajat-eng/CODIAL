const express= require('express');
const app=express();
const port=8000;

const expressLayouts=require('express-ejs-layouts');


// use layouts
app.use(expressLayouts);
// extract style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// use static
app.use(express.static('./assets'));


//  use routes
app.use('/',require('./routes'));


// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// running engine
app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`server is running on port:${port}`);
})