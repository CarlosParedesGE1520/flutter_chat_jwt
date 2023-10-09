

const jwt = require('jsonwebtoken');

const validarJWT = (req,res,next) => {

    // leer token
    const token = req.header('x-token');

    if (!token) {
       return res.status(401).json({
        ok: false,
        msg: 'No hay token en la peticion'
       }) 
    }


    try {
        const {uid} = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;
        console.log(uid);
        next();
    } catch (error) {
        return res.status(401).json({
            ok :false ,
            msg: 'token no valido'
        })
    }
    //console.log(token);
};

module.exports = {
    validarJWT
}