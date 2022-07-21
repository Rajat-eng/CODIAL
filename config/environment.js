const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)|| fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory,
})

const development={
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething', //
    db:'codeial_development',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user: "vrajat269@gmail.com",
            pass: "ozkn amrm icmb eopd",  // 2 step verification password req
        }
    },
    google_client_id: '1063508045916-uq84svdj2aeo5er4amk6ci7llpiik8bh.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    google_client_secret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret_key: 'codeial',
    morgan:{
        mode:'dev',
        options:{
            stream:accessLogStream
        }
    }
}

const production={
    name:'production',
    asset_path:process.env.assetPath,
    session_cookie_key:process.env.session_cookie_key,
    db:process.env.codeial_db,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user: process.env.gmail_user_name,
            pass: process.env.gmail_password,  // 2 step verification password req
        }
    },
    google_client_id: process.env.google_client_id, // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    google_client_secret: process.env.google_client_secret, // e.g. _ASDFA%KFJWIASDFASD#FAD-
    google_callback_url: process.env.google_callback_url,
    jwt_secret_key: process.env.jwt_secret_key,
    morgan:{
        mode:'combined',
        options:{
            stream:accessLogStream
        }
    }
}

module.exports=eval(process.env.CODEIAL_ENVIRONMENT)== undefined ?  development: eval(process.env.CODEIAL_ENVIRONMENT);

//module.exports=development;