const router = require("express").Router();

const Song = require("../models/song");

router.post("/save", async (req, res) => {
    const newSong = new Song(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL: req.body.songURL,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
        }
    );
    try {
        const saveSong = await newSong.save();
        return res.status(200).send({ success: true, song: saveSong });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const data = await Song.findOne(filter);
    if (data) {
        return res.status(200).send({ success: true, song: data });
    } else {
        return res.status(400).send({ success: false, msg: "Không tìm thấy dữ liệu" });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const data = await Song.find().sort({ createdAt: 1 });
        return res.status(200).send({ success: true, songs: data });
    } catch (error) {
        return res.status(400).send({ success: false, msg: "Không tìm thấy dữ liệu" });
    }
});

router.put("/update/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const options = {
        upsert: true,
        new: true
    };
    try {
        const result = await Song.findOneAndUpdate(filter, {
            name: req.body.name,
            imageURL: req.body.imageURL,
            facebook: req.body.facebook,
        }, options);
        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const result = await Song.deleteOne(filter);
    if (result) {
        return res.status(200).send({ success: true, song: "Đã xóa thành công", data: result });
    } else {
        return res.status(400).send({ success: false, msg: "Không tìm thấy dữ liệu" });
    }
});

module.exports = router;
