import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import React, { useState } from 'react';

const AlbumTile = ({ album, selectedAlbum, setSelectedAlbum, onUpdateAlbum, onDeleteAlbum, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlbum, setEditedAlbum] = useState(album);

  const handleEdit = (album) => {
    setSelectedAlbum(album)
    setEditedAlbum(album)
    setIsEditing(true);
  };

  //working
  const handleUpdate = () => {
    setEditedAlbum(selectedAlbum); // this doesn't require to reload data from backend
    onUpdateAlbum(album._id, selectedAlbum);
    setIsEditing(false);
  };

  // working
  const handleCancel = () => {
    setIsEditing(false);
    setEditedAlbum(album);
  };

  // working
  const handleDelete = (id) => {
    console.log("deleting album with id " + id)
    const data = onDeleteAlbum(id);
console.log({data})
  };

  return (
    <div key={album.id} className="w-64 h-64 m-4 rounded overflow-hidden shadow-lg bg-white" style={{backgroundImage: `url(${album.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {isEditing ? (
        <form >
          {children}
          <div className="m-6">
          <button className="bg-green-500 text-white" onClick={handleUpdate}>
            Update
          </button>
          
          <button className="bg-red-500 text-white" onClick={handleCancel}>
            Cancel
          </button>
          </div>
          
        </form>
      ) : (

        <div className="relative p-6 m-4 rounded-lg" key={album._id}>

          <div className="absolute top-0 right-0">
            <button onClick={() => handleEdit(album)}>
              <BiEdit className="mr-5"  />
            </button>
            <button onClick={() => handleDelete(album._id)}>
              <AiOutlineClose  />
            </button>
          </div>

          <h3 className="text-lg font-bold">{editedAlbum.title}</h3>
          <p className="text-gray-700 text-base">
            Created by: {editedAlbum.createdBy} at {editedAlbum.createdAt} 
          </p>
          <p className="text-gray-700 text-base">
            Id: {editedAlbum._id}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlbumTile;