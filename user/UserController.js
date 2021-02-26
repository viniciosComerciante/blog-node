const express = require('express');
const router  = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', (req, res)=>{

    User.findAll().then((users)=>{
            res.render('./admin/users/index', {users:users});
    })


});


router.get('/admin/users/create', (req, res)=>{
    res.render('./admin/users/create', {erro:''});
})

router.post("/users/create", (req, res)=>{

    const email = req.body.email;
    const password = req.body.password;
    let erro = '';
    if(email ==''){
        erro = "email precisa ser preenchido";
    }

    User.findOne({
        where:{
            email: email,
        }
    }).then((user)=>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash,

            }).then(()=>{
                res.redirect('/admin/users');
                
            }).catch((err)=>{
                res.send('não foi possivel criar usuario');
            })
        }else{
            if(erro ==''){
                erro = "usuario já cadastrado";
                res.render('./admin/users/create', {erro: erro})
            }else{
                res.render('./admin/users/create', {erro: erro})
            }
            
        }
    })


    

})


module.exports = router;