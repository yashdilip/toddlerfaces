import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from  './images'
import { dbConnect } from "../../../lib/db-connect";


export default async function handler(req, res) {
  dbConnect().catch(error => response.json({ message: "Connection Failed...!"}))

  /* const { method } = req

  switch (method.toUpperCase()) {
    case 'GET':
      if (req && req.params && req.params.id) {
        return getImageById(req, res);
      }
      return getImages(req, res);
    case 'POST':
      return createImage(req, res);
    case 'PUT':
      return updateImage(req, res);
    case 'DELETE':
      return deleteImage(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);

      res.status(405).send({
        success: false,
        message: 'Method Not Allowed'
      });
      break;
  }*/

  const { method, path } = req

  switch(method) {
    case 'GET':
      switch(path) {
        case '/foo':
          getImageById(req, res);
          break;
        case '/bar':
          getImages(req,res)
          break;
      }
      break;
    case 'POST':
      switch(path) {
        case '/foo/bar':
          getImageById(req, res);
          break;
        case '/bar/foo':
          getImages(req,res)
          break;
      }
      break;
  }

  switch(req.body.action) {
    case 'create':
      handleCreate(req, res);
      break;
    break;
  }
}