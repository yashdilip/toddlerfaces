import React, { useState, useEffect } from 'react';
import AlbumTile from '../album/albumTile';
import { fetchAlbums, onCreateAlbum, onUpdateAlbum, onDeleteAlbum } from '../../service/album-service';

const AlbumTiles = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albums = await fetchAlbums();
        setAlbums(albums);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const [newAlbum, setNewAlbum] = useState({ title: '', createdAt: '', createdBy: '' });

  // working 
  const handleCreateAlbum = async () => {
    // Call the onCreateAlbum function with the newAlbum object
    await onCreateAlbum(newAlbum);

    // Reset the newAlbum state to its initial value
    setNewAlbum({ title: '', createdAt: '', createdBy: '' });
  };

  return (
    <div className="flex flex-wrap">
      {albums.map((album) => (
        <AlbumTile
          album={album}
          onUpdateAlbum={onUpdateAlbum}
          onDeleteAlbum={onDeleteAlbum}
          selectedAlbum={selectedAlbum}
          setSelectedAlbum={setSelectedAlbum}
          key={album._id}
        >
        <div className="p-6 m-4 " key={selectedAlbum._id}>
          <input
            type="text"
            name="title"
            value={selectedAlbum.title}
            onChange={(event) => {
              const { name, value } = event.target;
              setSelectedAlbum({
                ...selectedAlbum,
                [name]: value,
              });
            }}
            placeholder="Title"
          />
          <input
            type="text"
            name="createdAt"
            value={selectedAlbum.createdAt}
            onChange={(event) => {
              const { name, value } = event.target;
              setSelectedAlbum({
                ...selectedAlbum,
                [name]: value,
              });
            }}
            placeholder="Created At"
          />
          <input
            type="text"
            name="createdBy"
            value={selectedAlbum.createdBy}
            onChange={(event) => {
              const { name, value } = event.target;
              setSelectedAlbum({
                ...selectedAlbum,
                [name]: value,
              });
            }}
            placeholder="Created By"
          />
          </div>
        </AlbumTile>
      ))}
      <div className="w-64 h-64 p-6 m-4 rounded overflow-hidden shadow-lg bg-white" key="createAlbum">
        <form>
          <input
            type="text"
            value={newAlbum.title}
            onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
            placeholder="Title"
          />
          <input
            type="text"
            value={newAlbum.createdAt}
            onChange={(e) => setNewAlbum({ ...newAlbum, createdAt: e.target.value })}
            placeholder="Created At"
          />
          <input
            type="text"
            value={newAlbum.createdBy}
            onChange={(e) => setNewAlbum({ ...newAlbum, createdBy: e.target.value })}
            placeholder="Created By"
          />
          <button onClick={handleCreateAlbum} className="bg-blue-500 text-white py-2 px-4 rounded-full">
            Create Album
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlbumTiles;
