const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const sharp = require('sharp')
const sharpS3 = require('multer-sharp-s3')

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        },
    }),
    s3: sharpS3({
        s3: new aws.S3(),
        Bucket: 'uploadwecheckout',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        ACL: 'public-read',
        Key: (req, file, cb) => {
            //console.log(`file S3`, file)
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                const filename = `${hash.toString('hex')}-${file.originalname}`

                cb(null, filename)
            })
        },
        resize: {
            width: 300,
        },
        max: true,
    }),
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
    fileFilter: async (req, file, cb) => {
        const allowedMines = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

        if (allowedMines.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb({
                name: `multerError`,
                message: `Invalid file Type`,
            })
        }
    },
}

/* var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'some-bucket',
        shouldTransform: function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [
            {
                id: 'original',
                key: function (req, file, cb) {
                    cb(null, 'image-original.jpg')
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().jpg())
                },
            },
            {
                id: 'thumbnail',
                key: function (req, file, cb) {
                    cb(null, 'image-thumbnail.jpg')
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(100, 100).jpg())
                },
            },
        ],
    }),
}) */
