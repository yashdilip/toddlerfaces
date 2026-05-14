import Album from '../../../models/album'

export const createAlbum = async (req, res) => {
  const newAlbum = new Album({...req.body});
  try {
    const album = await newAlbum.save();;
    res.status(201).json({album, message: 'Successfully created album'});
  } catch (err) {
    res.status(400).json({ message: 'Could not create album', error: err });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve Albums' });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve Album' });
  }
};

export const getAlbumsByUserId = async (req, res) => {
  try {
    const { userId } = req.query
    const albums = await Album.find({
      owner: userId
    });
    if (!albums) {
      return res.status(404).json({ message: 'Albums not found' });
    }
    res.status(200).json(albums);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve Albums' });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    delete data._id
    delete data._v //???

    if (id) {
      const album = await Album.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        context: 'query'
      });

      if (!album) {
        return res.status(404).json({ message: 'Album not found' });
      }
      return res.status(200).json({album, message: 'Successfully updated Album'});
    
    }
      
    res.status(404).json({message: 'Album not selected'});
      
    } catch (err) {
      res.status(400).json({ message: 'Failed to update Album' });
    }
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.query;

  try {
    const album = await Album.findByIdAndRemove(id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({ message: 'Album deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete Album' });
  }
};

export const shareAlbumByAlbumIdUserId = async (req, res) => {
  try {
    const { albumId, userId } = req.query
    const album = await Album.findById(albumId)

    if (!album) {
      return res.status(404).json({ message: 'Album not found' })
    }

    album.sharedWith.push(userId)

    await album.save()
    res.status(200).json({ message: 'Successfully shared the album' })
  } catch (error) {
    res.status(500).json ({ message: 'Failed to share the album', err: error })
  }
}