import express, { urlencoded } from 'express';
import cors from 'cors';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from "path";

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + nanoid(8) + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

app.use(cors({
        origin: ['http://localhost:5173", "http://localhost:3000'],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
    res.json({message: "route accessable"})
});

// MAIN
app.use('/upload', upload.single("shottie"), (req, res) => {
    console.log("shottie uploaded!");
    res.json({message: "shottie uploaded successfully"});
});



app.listen(3000, console.log("server running..."));