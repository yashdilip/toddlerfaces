import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from  './users'
import { dbConnect } from "../../../lib/db-connect";


export default async function handler(req, res) {
  dbConnect().catch(error => response.json({ message: "Connection Failed...!"}))

  const { method } = req

  switch (method.toUpperCase()) {
    case 'GET':
      if (req && req.params && req.params.id) {
        return getUserById(req, res);
      }
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);

      res.status(405).send({
        success: false,
        message: 'Method Not Allowed'
      });
      break;
  }
}