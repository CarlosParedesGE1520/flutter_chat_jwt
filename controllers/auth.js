
const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
//const {validationResult} = require('express-validator');

const crearUsuario = async ( req, res = response)=>  {

    const {email, password} = req.body;
    //;
    try {
        const usuario =  new Usuario(req.body);
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        await usuario.save();
        // Generar JWT

        const token = await  generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

   
}


const loginUsuario = async ( req, res = response)=>  {

    console.log("request: "+req.body);
    const {email, password} = req.body;

    try {
       
        const usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no esta registrado'
            })
        }
        
        const validPass= bcrypt.compareSync(password,usuario.password)

        if (!validPass) {
            return res.status(400).json({
                ok: false,
                msg: 'El pass es incorrecto'
            })
        }

        const token  = await generarJWT(usuario.id);


        return res.status(200).json({
            ok: true,
            usuario,
            token
        })

       
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin',
        })
    }

   
}

const renewToken = async(req,res = response) => {
    
    const uid =  req.uid;
    const token  = await generarJWT(uid);
    
    
    const usuario = await  Usuario.findById(uid);
    console.log(usuario);
    
    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken

}