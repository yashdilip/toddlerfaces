import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from  './albums'
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

  const { method } = req

  switch (method.toUpperCase()) {
    case 'GET':
      if (req?.query?.id) {
        return getAlbumById(req, res);
      }
      return getAlbums(req, res);
    case 'POST':
      return createAlbum(req, res);
    case 'PUT':
      return updateAlbum(req, res);
    case 'DELETE':
      return deleteAlbum(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);

      res.status(405).send({
        success: false,
        message: 'Method Not Allowed'
      });
      break;
  }
}
