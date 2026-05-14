import User from '../../../models/user';

export const getUsers = async (req, res) => {
  try {
    const users = await User
           .find()
           .limit(10);
    response.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve User' });
  }
};

export const createUser = async (req, res) => {
  const newUser = new User({...req.body});
  try {
    const user = await newUser.save();;
    res.status(201).json({user, message: 'Successfully created user'});
  } catch (err) {
    res.status(400).json({ message: 'Could not create user', error: err });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    delete data._id
    delete data._v //???

    if (id) {
      const User = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        context: 'query'
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({user, message: 'Successfully updated User'});
    
    }
      
    res.status(404).json({message: 'User not selected'});
      
    } catch (err) {
      res.status(400).json({ message: 'Failed to update User' });
    }
};

export const deleteUser = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findByIdAndRemove(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete User' });
  }
};