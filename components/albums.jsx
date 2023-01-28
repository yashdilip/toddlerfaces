import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from 'next/image';


export default function Albums() {
  /*
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    getAlbums();
  }, []);

  const getAlbums = async () => {
    try {
      const res = await axios.get('/api/albums');
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    try {
      if (selectedAlbum) {
        await axios.patch(`/api/albums/${selectedAlbum._id}`, {
          title,
          artist,
          releaseDate
        });
      } else {
        await axios.post('/api/albums', { title, artist, releaseDate });
      }
      setTitle('');
      setArtist('');
      setReleaseDate('');
      setSelectedAlbum(null);
      getAlbums();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAlbum = async (id) => {
    try {
      await axios.delete(`/api/albums/${id}`);
      getAlbums();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (album) => {
    setTitle(album.title);
    setArtist(album.artist);
    setReleaseDate(album.releaseDate);
    setSelectedAlbum(album);
  };
*/

  const albums = [
    {
      _id: '1',
      title: 'Thriller',
      artist: 'Michael Jackson',
      releaseDate: '1982-11-30',
      coverImage: 'https://images.unsplash.com/photo-1511497584790-2509e6dbb6a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      _id: '2',
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      releaseDate: '1973-03-01',
      coverImage: 'https://images.unsplash.com/photo-1549172451-f2c2b9c9f9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      _id: '3',
      title: 'The Bodyguard',
      artist: 'Whitney Houston',
      releaseDate: '1992-11-17',
      coverImage: 'https://images.unsplash.com/photo-1511497584790-2509e6dbb6a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  ];


  const [view, setView] = useState('table');

  const handleCreate = () => {
    console.log("Creating a new album");
    return (
      <AlbumTiles albums={albums} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
    );
  }

  const handleEdit = (albumId) => {
    console.log(`Editing album with id: ${albumId}`);
  }

  const handleDelete = (albumId) => {
    console.log(`Deleting album with id: ${albumId}`);
  }

  /*
  const AlbumTile = ({ album, onEdit, onDelete }) => {
    return (
      <div className="w-1/3 p-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img src={album.coverImage} alt={album.title} className="w-full h-32 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-medium">{album.title}</h3>
            <p className="text-gray-600">{album.artist}</p>
            <p className="text-gray-600">{album.releaseDate}</p>
            <button onClick={() => onEdit(album._id)} className="bg-blue-500 text-white p-2 rounded-lg mx-2">Edit</button>
            <button onClick={() => onDelete(album._id)} className="bg-red-500 text-white p-2 rounded-lg">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const AlbumTile = ({ album, onEdit, onDelete }) => {
    return (
      <div className="w-1/3 p-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img src={album.coverImage} alt={album.title} className="w-full h-32 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-medium">{album.title}</h3>
            <p className="text-gray-600">{album.artist}</p>
            <p className="text-gray-600">{album.releaseDate}</p>
            <button onClick={() => onEdit(album._id)} className="bg-blue-500 text-white p-2 rounded-lg mx-2">Edit</button>
            <button onClick={() => onDelete(album._id)} className="bg-red-500 text-white p-2 rounded-lg">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const AlbumTile = ({ album, onEdit, onDelete, onCreate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    return (
      <div className="w-1/3 p-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          {isCreating || isEditing ? (
            <form>
              <div className="p-4">
                <label>
                  <p className="text-gray-600">Title</p>
                  <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.title : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Artist</p>
                  <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.artist : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Release Date</p>
                  <input type="date" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.releaseDate : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Cover Image</p>
                  <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.coverImage : ""} />
                </label>
                {isEditing ? (
                  <>
                    <button onClick={() => onEdit(album)} className="bg-green-500 text-white p-2 rounded-lg mx-2">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded-lg">Cancel</button>
                  </>
                ) : (
                    <>
                      <button onClick={() => onCreate()} className="bg-green-500 text-white p-2 rounded-lg mx-2">Save</button>
                      <button onClick={() => setIsCreating(false)} className="bg-red-500 text-white p-2 rounded-lg">Cancel</button>
                    </>
                  )}
              </div>
            </form>
          ) : (
              <>
                {album ? (
                  <>
                    <img src={album.coverImage} alt={album.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{album.title}</h3>

                      <p className="text-gray--600">{album.artist}</p>
                      <p className="text-gray-600">{album.releaseDate}</p>
                      <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded-lg">Edit</button>
                      <button onClick={() => onDelete(album._id)} className="bg-red-500 text-white p-2 rounded-lg">Delete</button>
                    </div>
                  </>
                ) : (
                    <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white p-4 rounded-lg w-full">Create Album</button>
                  )}
              </>
            )}
        </div>
      </div>
    );
  };
  */

  const AlbumTile = ({ album, onEdit, onDelete, onCreate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [image, setImage] = useState(album ? album.coverImage : null);

    const handleFileChange = event => {
      setImage(URL.createObjectURL(event.target.files[0]));
    };

    return (
      <div className="w-1/3 p-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          {isCreating || isEditing ? (
            <form>
              <div className="p-4">
                <label>
                  <p className="text-gray-600">Title</p>
                  <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.title : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Artist</p>
                  <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.artist : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Release Date</p>
                  <input type="date" className="bg-gray-200 p-2 rounded-lg w-full" defaultValue={album ? album.releaseDate : ""} />
                </label>
                <label>
                  <p className="text-gray-600">Cover Image</p>
                  <input type="file" className="bg-gray-200 p-2 rounded-lg w-full" accept="image/*" onChange={handleFileChange} />
                  <Image src={image} alt={album ? album.title : "album"} className="w-full h-32 object-cover" />
                </label>
                {isEditing ? (
                  <>
                    <button onClick={() => onEdit({ ...album, coverImage: image })} className="bg-green-500 text-white p-2 rounded-lg mx-2">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded-lg">Cancel</button>
                  </>
                ) : (
                    <>
                      <button onClick={() => onCreate({ title: title, artist: artist, releaseDate: releaseDate, coverImage: image })} className="bg-green-500 text-white p-2 rounded-lg mx-2">Save</button>
                      <button onClick={() => setIsCreating(false)} className="bg-red-500 text-white p-2 rounded-lg">Cancel</button>
                    </>
                  )}
              </div>
            </form>
          ) : (
              <>
                {album ? (
                  <>
                    <Image src={album.coverImage} alt={album.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{album.title}</h3>
                      <p className="text-gray-600">{album.artist}</p>
                      <p className="text-gray-600">{album.releaseDate}</p>
                      <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded-lg">Edit</button>
                      <button onClick={() => onDelete(album._id)} className="bg-red-500 text-white p-2 rounded-lg">Delete</button>
                    </div>
                  </>
                ) : (
                    <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white p-4 rounded-lg w-full">Create Album</button>
                  )}
              </>
            )}
        </div>
      </div>
    );
  };


  const AlbumTiles = ({ albums, onEdit, onDelete, onCreate }) => {
    const [isCreating, setIsCreating] = useState(false);

    return (
      <div className="flex flex-wrap -mx-4">
        {albums.map(album => (
          <AlbumTile key={album._id} album={album} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {isCreating ? (
          <div className="w-1/3 p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <form>
                <div className="p-4">
                  <label>
                    <p className="text-gray-600">Title</p>
                    <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" />
                  </label>
                  <label>
                    <p className="text-gray-600">Artist</p>
                    <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" />
                  </label>
                  <label>
                    <p className="text-gray-600">Release Date</p>
                    <input type="date" className="bg-gray-200 p-2 rounded-lg w-full" />
                  </label>
                  <label>
                    <p className="text-gray-600">Cover Image</p>
                    <input type="text" className="bg-gray-200 p-2 rounded-lg w-full" />
                  </label>
                  <button type="submit" className="bg-green-500 text-white p-2 rounded-lg mx-2">Save</button>
                  <button onClick={() => setIsCreating(false)} className="bg-red-500 text-white p-2 rounded-lg">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
            <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white p-4 rounded-lg w-1/3">Create Album</button>
          )}
      </div>
    );
  };




  /*
  const AlbumTiles = ({ albums, onCreate, onEdit, onDelete }) => {
    return (
      <div className="flex flex-wrap -mx-4">
        <button onClick={onCreate} className="bg-green-500 text-white p-4 rounded-lg w-full">Create Album</button>
        {albums.map(album => (
          <AlbumTile key={album._id} album={album} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    );
  };
  */

  const AlbumTable = ({ albums }) => {
    return (
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Artist</th>
            <th className="px-4 py-2">Release Date</th>
          </tr>
        </thead>
        <tbody>
          {albums.map(album => (
            <tr key={album._id}>
              <td className="border px-4 py-2">{album.title}</td>
              <td className="border px-4 py-2">{album.artist}</td>
              <td className="border px-4 py-2">{album.releaseDate}</td>
              <td>
                <button onClick={() => handleEdit(album)}>Edit</button>
                <button onClick={() => deleteAlbum(album._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="mx-auto container darj:bg-gray-800 dark:text-white">
      <button onClick={() => setView(view === 'table' ? 'tiles' : 'table')} className="bg-blue-500 text-white p-2 rounded-lg">
        Toggle View: {view === 'table' ? 'Tiles' : 'Table'}
      </button>
      {view === 'table' ? (
        <AlbumTable albums={albums} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
          <AlbumTiles albums={albums} onEdit={handleEdit} onDelete={handleDelete} />
        )}
    </div>


    // <div>
    //   <h2>Album CRUD</h2>
    //   <form onSubmit={createAlbum}>
    //     <label>
    //       Title:
    //       <input
    //         type="text"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Artist:
    //       <input
    //         type="text"
    //         value={artist}
    //         onChange={(e) => setArtist(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Release Date:
    //       <input
    //         type="date"
    //         value={releaseDate}
    //         onChange={(e) => setReleaseDate(e.target.value)}
    //       />
    //     </label>
    //     <button type="submit">{selectedAlbum ? 'Update' : 'Create'}</button>
    //   </form>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>Title</th>
    //         <th>Artist</th>
    //         <th>Release Date</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {albums.map((album) => (
    //         <tr key={album._id}>
    //           <td>{album.title}</td>
    //           <td>{album.artist}</td>
    //           <td>{album.releaseDate}</td>
    //           <td>
    //             <button onClick={() => handleEdit(album)}>Edit</button>
    //             <button onClick={() => deleteAlbum(album._id)}>Delete</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
};