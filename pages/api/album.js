import Album from '../../models/album'

exports.create = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const data = JSON.parse(event.body);
    const album = new Album({
      title: data.title,
      artist: data.artist,
      releaseDate: data.releaseDate
    });
    await album.save();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully created album',
        album: album
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not create album',
        error: err
      })
    };
  }
};

exports.read = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const album = await Album.findById(event.pathParameters.id);
    if (!album) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Album not found'
        })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        album
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not fetch album',
        error: err
      })
    };
  }
};

exports.update = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const data = JSON.parse(event.body);
    const album = await Album.findByIdAndUpdate(event.pathParameters.id, data, {
      new: true
    });
    if (!album) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Album not found'
        })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully updated album',
        album: album
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not update album',
        error: err
      })
    };
  }
};


exports.delete = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const album = await Album.findByIdAndRemove(event.pathParameters.id);
    if (!album) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Album not found'
        })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully deleted album'
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not delete album',
        error: err
      })
    };
  }
};
