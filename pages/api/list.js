import { dbConnect } from "../../lib/db-connect";
import User from '../../models/user';

export default async function handler(request, response) {
   try {
       await dbConnect();

       const users = await User
           .find()
           .limit(10);

       response.status(200).json(users);
   } catch (e) {
       console.error(e);
   }
};