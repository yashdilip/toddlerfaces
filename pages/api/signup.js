import { dbConnect } from "../../lib/db-connect";
import User from '../../models/user';
import bcrypt from 'bcrypt';


export default async function handler(request, response) {

  dbConnect().catch(error => response.json({ message: "Connection Failed...!"}))

  if (request.method === "POST") {

    if (!request.body) {
      return response.status(404).json({message: "Don't have form data...!"})
    }

    const { username, email, password } = request.body;

    const checkExiting = await User.findOne({ email })

    if (checkExiting) {
      return response.status(422).json({ message: "User already exists...!" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({username, email, password:hashedPassword})

    const validationError = user.validateSync();
    if (validationError) {
      return response.status(400).json({ error: validationError })
    }

    await user.save()

    return response.status(201).json({ message: "User created successfully...!"})

  }
};