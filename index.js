const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config()
// var bodyParser = require('body-parser');
// const multer = require('multer');

// const upload = multer({
//     dest: 'uploads/',
//     limits: { fileSize: 10 * 1024 * 1024 }
// })

const app = express();
app.use(express.json());

// app.use(bodyParser.json({
//     limit: '50mb'
// }));

// app.use(bodyParser.urlencoded({
//     limit: '50mb',
//     parameterLimit: 100000,
//     extended: true
// }));

// bodyParser = {
//     json: {limit: '50mb', extended: true},
//     urlencoded: {limit: '50mb', extended: true}
// };
// app.use(bodyParser.json({
//     limit: '50mb'
// }));

// Increase payload size limit
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.bodyParser({limit: '50mb'}));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb', extended: true}));

// app.use(bodyParser.json({limit: "5mb"}));
// app.use(bodyParser.urlencoded({limit: "5mb", extended: true}));


app.use(cors());

const port = 5000;


const Images = require('./model/imageSchema');

mongoose.connect(process.env.DB_URL, { dbName: "images" })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


// app.get('/', (req, res) => {
//     try {
//         Images.find({}).then(data => {
//             res.json(data)
//         }).catch(error => {
//             res.status(408).json({ error })
//         })
//     } catch (error) {
//         res.json({ error })
//     }
// })

// app.post('/upload', async (req, res) => {
//     const body = req.body;
//     try {
//         const newImage = await Images.create(body)
//         newImage.save();
//         res.status(201).json({ msg: "New image uploaded...!" })
//     } catch (error) {
//         res.status(409).json({ message: error.message })
//     }
// })


const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix +"_"+ file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("myFile"), async (req, res) => {
    console.log(req.body);
    const imageName = req.file.filename;

    try {
        await Images.create({ myFile: imageName, fileLink: `${req.protocol}://${req.hostname}/uploads/${imageName}` });
        res.json({ status: "ok" });
    } catch (error) {
        res.json({ status: error });
    }
});

app.get("/", async (req, res) => {
    // console.log(`${req.protocol}://${req.hostname}`);
    try {
        Images.find({}).then((data) => {
            res.send({ status: "ok", data: data });
        });
    } catch (error) {
        res.json({ status: error });
    }
    // res.send("Hello World!");
});




app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})

