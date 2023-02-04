import axios from 'axios';

const fetchAlbums = async () => {
  try {
    const response = await axios.get('/api/albums');
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onCreateAlbum = async (album) => {
  try {
    console.log({album})
    const response = await axios.post('/api/albums', album);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onUpdateAlbum = async (id, album) => {
  try {
    const response = await axios.put(`/api/albums?id=${id}`, album);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const onDeleteAlbum = async (id) => {
  try {
    const response = await axios.delete(`/api/albums?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export { fetchAlbums, onCreateAlbum, onUpdateAlbum, onDeleteAlbum };