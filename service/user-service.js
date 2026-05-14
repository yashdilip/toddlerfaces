import axios from 'axios';

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onCreateUser = async (album) => {
  try {
    const response = await axios.post('/api/users', album);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onUpdateUser = async (id, album) => {
  try {
    const response = await axios.put(`/api/users?id=${id}`, album);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onDeleteUser = async (id) => {
  try {
    const response = await axios.delete(`/api/users?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export { fetchUsers, onCreateUser, onUpdateUser, onDeleteUser };