/* eslint-disable no-async-promise-executor */
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (authHeader) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        if (!authHeader)
            return reject({
                name: `userToken`,
                message: `No token provided`,
            })

        try {
            //console.log(jwt.verify(authHeader, process.env.APP_SECRET))
            decoded = jwt.verify(authHeader, process.env.APP_SECRET)
        } catch (error) {
            return reject(error)
        }

        const { id, user } = decoded

        // Fetch the user by id
        const UserExist = await User.findOne({ where: { id, user } })

        if (!UserExist)
            return reject({
                name: `userToken`,
                message: `User informed by token not exists`,
            })
        else return resolve({ user_id: UserExist.id })
    })
}
