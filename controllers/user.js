import User from "../models/user";

/**
 * Obtiene solo un registro de la base de datos.
 * @param {id} req 
 * @param {json} res 
 * @param {func} next 
 */
export const user = (req, res, next) => {
    const { id } = req.query;
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            return res.json({ error: true, data: err, message: "No se pudo obtener la información" });
        }

        res.json({ error: false, data: user, message: "No hay errores" });
    });
};

/**
 * Agrega un registro a la base de datos.
 * @param {firstname, lastname, email, password, role} req 
 * @param {json} res 
 */
export const add = (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;

    const newUser = new User({
        firstname,
        lastname,
        email,
        password,
        role,
        active: true
    });

    let valErr = newUser.validateSync();

    newUser.save(function(err) {
        if (err) {
            res.json({ error: true, data: valErr ? valErr : err, message: "No se pudo insertar" });
        } else {
            res.json({ error: false, data: newUser, message: "Se inserto correctamente" });
        }
    });
};

/**
 * Actualiza información de un registro.
 * @param {firstname, lastname, email, password, role} req 
 * @param {json} res 
 */
export const update = (req, res) => {
    const { firstname, lastname, email, password, role, active } = req.body;

    const refs = {
        email
    };

    const updates = {
        firstname,
        lastname,
        email,
        password,
        role,
        active
    };

    User.update(refs, updates, function(err, id) {
        if (err) {
            return res.json({ error: true, data: err, message: "No se pudo Actualizar el registro" });
        } else {
            res.json({ error: false, data: id, message: "Se actualizo correctamente" });
        }
    });
};

/**
 * Da de baja un registro
 * @param {refs} req 
 * @param {json} res 
 */
export const remove = (req, res) => {
    const { id } = req.body;
    User.update({ _id: id }, { active: false }, function(err, id, resp) {
        if (err) {
            return res.json({ error: true, data: err, message: "No se pudo dar de baja el registro" });
        } else {
            res.json({ error: false, data: id, message: "Se actualizo correctamente" });
        }
    });
};

/**
 * Ontiene un listado de la base de datos.
 * @param {text, page, limit, sort} req 
 * @param {json} res 
 * @param {func} next 
 */
export const users = (req, res, next) => {
    const { text, page, limit, sort } = req.query;
    let aggregate = [];

    if (typeof text !== "undefined") {
        aggregate.push({
            $match: {
                $or: [
                    { firstname: { $regex: text, $options: 'i' } },
                    { lastname: { $regex: text, $options: 'i' } },
                    { email: { $regex: text, $options: 'i' } },
                    { role: { $regex: text, $options: 'i' } },
                    { entryDate: { $regex: text, $options: 'i' } }
                ]
            }
        });
    }

    if (typeof page !== "undefined" && typeof limit !== "undefined") {
        let skip = (page - 1) * limit;

        aggregate.push({ $skip: skip });
        aggregate.push({ $limit: parseInt(limit) });
    } else if (typeof limit !== "undefined") {

        aggregate.push({ $limit: parseInt(limit) });
    }

    if (typeof sort !== "undefined") {
        let order = sort.substring(0, 1) === '-' ? -1 : 1;
        let field = sort;

        if (field.charAt(0) === '-' || field.charAt(0) === '+') {
            field = field.substring(1);
        }

        field = field.replace(/^\s+|\s+$/g, '');

        aggregate.push({
            $sort: {
                [field]: order
            }
        });
    }

    // Default
    if (aggregate.length === 0) {
        aggregate.push({ $sort: { firstname: 1 } }); // Cambia dependiendo del Modelo
    }

    User.aggregate(aggregate, (err, data) => {
        if (err) {
            res.json({ error: true, data: err, message: "No se pudo obtener la información" });
        }

        res.json({ error: false, data: data, message: "No hay errores" });
    });
};