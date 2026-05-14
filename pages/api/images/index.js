import {
  createImageReference,
  getImageById,
  getImagesByAlbumId,
  updateImage,
} from  './images'
import { dbConnect } from "../../../lib/db-connect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";


export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ message: "Connection failed." });
  }

  const session = await getServerSession(req, res, authOptions);
  req.sessionUser = session?.user || null;

  const { method, query } = req;

  switch (method.toUpperCase()) {
    case 'GET':
      if (query.id) {
        return getImageById(req, res);
      }
      return getImagesByAlbumId(req, res);
    case 'POST':
      return createImageReference(req, res);
    case 'PUT':
      return updateImage(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({
        success: false,
        message: 'Method Not Allowed'
      });
  }
}
