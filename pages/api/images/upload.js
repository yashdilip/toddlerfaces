export const config = {
  api: {
      bodyParser: {
          sizeLimit: '4mb' // Set desired value here
      }
  }
}
import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  },
})

const upload = multer({ storage }).single('file')

const uploadImageHandler = async (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      console.error(error)
      return res.status(500).send({ error: error.message })
    }

    if (!req.file) {
      return res.status(400).send({ error: 'File is required' })
    }

    res.status(200).send({ id: req.file.filename, path: req.file.path })
  })
}

export default uploadImageHandler

