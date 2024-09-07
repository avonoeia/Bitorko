const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const fileName = file.fieldname + "-" + req.user.username + "-" + uniqueSuffix + "." + extension
        req.body.post_image_content = `/assets/uploads/${fileName}`;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image"));
        }

        cb(undefined, true);
    },
});

module.exports = upload;
