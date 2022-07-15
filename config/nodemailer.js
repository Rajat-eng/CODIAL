const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');

// config emails
let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user: "vrajat269@gmail.com",
        pass: "ozkn amrm icmb eopd",  // 2 step verification password req
    }
});

// template for mails
let renderTemplate=(data,relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("error in rendering email template" ,err);
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
}