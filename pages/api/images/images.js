
export const uploadImage = async (req, res) => {
  try {
    const { albumId } = req.query
    const newImage = await Image.create({
      album: albumId,
      path: req.file.path
    })
    res.status(201).json({newImage, message: 'Successfully uploaded'});
  } catch (error) {
    res.status(400).json({ message: 'Could not upload an Image', error: err });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const { albumId } = req.query
    const images = req.files.map((file) => {
      return {
        album: albumId,
        path: file.path
      }
    })

    const newImages = await Image.create(images)
    res.status(201).json({newImages, message: 'Successfully uploaded'});
  } catch (error) {
    res.status(400).json({ message: 'Could not upload Images', error: err });
  }
};

export const getImageById = async (req, res) => {
try {
  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ message: 'Image not found' });
  // res.send(image);
  res.status(201).json({image});
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve an Image', error: err });
  }
};


export const findImagesByAlbumId = async (req, res) => {
  try {
    const { albumId } = req.query
    const images = await Image.find({
      album: albumId
    })

    if (!images) return res.status(404).json({ message: 'Images not found' });
    // res.send(images);
    res.status(201).json({images});
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve Images', error: err });
  }
}

export const updateImage = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;

    if (id) {
      const image = await Image.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        context: 'query'
      });

      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      return res.status(200).json({image, message: 'Successfully updated Image'});
    
    }
      
    res.status(404).json({message: 'Image not selected'});

  } catch (error) {
      res.status(400).json({ message: 'Failed to update Image' });
  }
};

export const deleteImageByImageIdAndAlbumId = async (req, res) => {
  try {
    const { imageId, albumId } = req.query;

    const image = await Image.findOneAndDelete({
      _id: imageId,
      album: albumId
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ message: 'Image deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete Image' });
  }
};

export const deleteImagesByImageIdsAndAlbumId = async (req, res) => {
  try {
    const { imageIds, albumId } = req.query;

    const images = await Image.deleteMany({
      _id: { $in: imageIds },
      album: albumId
    });

    if (!images) {
      return res.status(404).json({ message: 'Images not found' });
    }

    res.status(200).json({ message: 'Images deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete Images' });
  }
};

export const getImagesByAlbumId = async (req, res) => {
  try {
    const { albumId } = req.query;
    const images = await Image.find({ album: albumId})

    if (!images) {
      return res.status(404).json({ message: 'Images not found' });
    }

    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({message: 'Failed to retrive images of the album'})
  }
}