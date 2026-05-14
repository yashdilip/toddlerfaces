export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadImageHandler = async (req, res) => {
  if (process.env.ENABLE_LOCAL_DEV_UPLOADS !== "true") {
    return res.status(410).json({
      message: "Direct file uploads are not available. Add images from a parent or photographer controlled storage provider.",
    })
  }

  return res.status(501).json({
    message: "Please add this image from an external storage source.",
  })
}

export default uploadImageHandler
