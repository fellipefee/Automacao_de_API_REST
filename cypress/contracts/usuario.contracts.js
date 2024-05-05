const Joi = require('joi')

//teste de contrato de usuario (validando os tipos dos atributos dos mesmos)
const usuarioSchema = Joi.object({
    quantidade : Joi.number(),
    usuarios : Joi.array().items({
        nome : Joi.string(),
        email : Joi.string(),
        password : Joi.string(),
        administrador : Joi.boolean(),
        _id : Joi.string()
    })
})

//faz o export da const para ser visivel a outros metodos
export default usuarioSchema