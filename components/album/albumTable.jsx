const AlbumTable = ({ albums }) => {  
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
        {albums && albums.map(album => (
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

export default AlbumTable;