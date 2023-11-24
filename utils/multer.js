import multer from 'multer'

const storage = multer.diskStorage({});

const checkFileType = (req, file, callback) => {
    console.log(file)
    if (!file.mimetype.startsWith("image")) {
        callback("Supported only image files", false)
    }
    callback(null, true)
}

export const upload = multer({
    storage,
    fileFilter: checkFileType
})
