export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadImageHandler = async (req, res) => {
  if (process.env.ENABLE_LOCAL_DEV_UPLOADS !== "true") {
    return res.status(410).json({
      message: "Local binary uploads are disabled. Toddlerfaces production storage uses external media references so original child photos stay in parent or photographer controlled storage.",
    })
  }

  return res.status(501).json({
    message: "Local development uploads are intentionally not implemented in the production path. Use /api/images with an external sourceUrl.",
  })
}

export default uploadImageHandler
