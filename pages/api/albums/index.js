import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from  './albums'
import { dbConnect } from "../../../lib/db-connect";


export default async function handler(req, res) {
  dbConnect().catch(error => response.json({ message: "Connection Failed...!"}))

  const { method } = req

  switch (method.toUpperCase()) {
    case 'GET':
      if (req && req.params && req.params.id) {
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