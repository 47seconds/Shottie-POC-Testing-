import express, { urlencoded } from 'express';
import cors from 'cors';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from "path";
import fs from 'fs';
import { exec } from 'child_process';
import { error } from 'console';
import { stderr, stdout } from 'process';

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
    
    const shottieId = nanoid(10);
    const shottiePath = req.file.path;
    const outputPath = `./uploads/shotties/${shottieId}`;
    const hlsPath = `${outputPath}/index.m3u8`;     // making a index file for our video

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, {recursive: true});    // our directory have multiple and sub-dierectories, therefore recursice = true
    }

    // ffmpeg
    const ffmpegCommand = `ffmpeg -i ${shottiePath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
    
    // NOT to be run on server, but on seperate instances with queues
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`exec errors: ${error}`);
            fs.unlinkSync(shottiePath);
        };
        console.log(`stdout: ${stdout}`);       
        console.log(`stderr: ${stderr}`);
        
        fs.unlinkSync(shottiePath);

        const shottieUrl = `http://localhost:3000/uploads/shotties/${shottieId}/index.m3u8`;

        res.json({
            message: "Video converted successfully",
            videoUrl: shottieUrl,
        });
    });
});



app.listen(3000, console.log("server running..."));