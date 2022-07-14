const nodemailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    console.log('new comment mailer');
    nodemailer.transporter.sendMail({
        from:'r1a1@gmail.com',
        to:'comment.user.email',
        subject:'new Comment Published',
        html:'<h1>Comment Published</h1>'
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('message sent',info);
        return;
    });
}