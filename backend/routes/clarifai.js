const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_KEY}`);

const upload = multer({
    storage: multer.memoryStorage({}),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter (_req, file, callback) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return callback(null, true);
        } else {
            callback('Error: Wrong image type');
        }
    }
});

// Unused
router.post('/', async function (req, res) {
    try {
        const { imageUrl } = req.body;
        const inputs = [
            {
                data: {
                    image: {
                        url: imageUrl
                    }
                }
            }
        ];
        const results = await recognizeFood(inputs);
        return res.send({
            results
        })
    } catch (err) {
        return res.status(400).send({
            error: err
        })
    }
});

router.post('/upload', upload.single('food_image'), async function (req, res) {
    try {
        const inputs = [
            {
                data: {
                    image: {
                        base64: req.file.buffer
                    }
                }
            }
        ]
        const results = await recognizeFood(inputs);
        return res.send({
            results
        })
    } catch (err) {
        res.status(400).send({
            error: err
        })
        console.log(err);
    }
})

function recognizeFood(inputs) {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                model_id: "food-item-v1-recognition",
                version_id: "dfebc169854e429086aceb8368662641",
                inputs: inputs
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject("Error: " + err);
                    return;
                }

                if (response.status.code !== 10000) {
                    reject("Received failed status: " + response.status.description + "\n" + response.status.details);
                    return;
                }

                let results = [];
                for (const c of response.outputs[0].data.concepts) {
                    results.push({
                        name: c.name,
                        value: c.value
                    })
                }
                // for (i = 0; i < 2; i++) {
                //     results.push({
                //         name: response.outputs[0].data.concepts[i].name,
                //         value: response.outputs[0].data.concepts[i].value
                //     })
                // }
                resolve(results);
            }
        );
    })
}

module.exports = router;