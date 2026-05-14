
import Image from '../../../models/Image';
import Album from '../../../models/album';
import { writeAuditLog } from '../../../lib/audit';

const canManageAlbum = (album, sessionUser) => {
  if (!album || !sessionUser) return false;
  return sessionUser.role === "admin" || album.owner?.toString() === sessionUser.id;
}

export const createImageReference = async (req, res) => {
  try {
    if (!req.sessionUser) {
      return res.status(401).json({ message: "Please sign in to add media." });
    }

    const { albumId, sourceUrl, thumbnailUrl, provider, caption, uploadAttestationAccepted } = req.body;

    if (!albumId || !sourceUrl) {
      return res.status(400).json({ message: "Album and image source URL are required." });
    }

    if (!uploadAttestationAccepted) {
      return res.status(400).json({ message: "Upload attestation is required for every media action." });
    }

    const album = await Album.findById(albumId);

    if (!canManageAlbum(album, req.sessionUser)) {
      return res.status(403).json({ message: "You do not have permission to add media to this album." });
    }

    const image = await Image.create({
      album: albumId,
      sourceUrl,
      thumbnailUrl: thumbnailUrl || sourceUrl,
      path: sourceUrl,
      provider: provider || album.mediaProvider || "external_url",
      caption,
      moderationStatus: "pending",
      uploadAttestation: {
        accepted: true,
        acceptedAt: new Date(),
        textVersion: "upload-attestation-v1",
        actorRole: req.sessionUser.role,
        ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
        userAgent: req.headers["user-agent"],
      },
    });

    album.images.addToSet(image._id);
    album.legalAudit.push({
      action: "media_reference_added",
      actorRole: req.sessionUser.role,
      attestationVersion: "upload-attestation-v1",
      acceptedAt: new Date(),
      ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
      userAgent: req.headers["user-agent"],
      sourceProvider: provider || album.mediaProvider,
      sourceUrl,
    });
    album.updatedAt = new Date();
    await album.save();

    await writeAuditLog(req, "media_reference_added", {
      targetType: "image",
      targetId: image._id,
      album: album._id,
      metadata: {
        sourceUrl,
        provider: provider || album.mediaProvider,
        attestationVersion: "upload-attestation-v1",
        moderationStatus: image.moderationStatus,
      },
    });

    return res.status(201).json({ image, message: "Media reference added for moderation." });
  } catch (error) {
    return res.status(400).json({ message: "Could not add media reference", error });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { albumId } = req.query
    const newImage = await Image.create({
      album: albumId,
      path: req.file.path
    })
    res.status(201).json({newImage, message: 'Successfully uploaded'});
  } catch (error) {
    res.status(400).json({ message: 'Could not upload an Image', error });
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
    res.status(400).json({ message: 'Could not upload Images', error });
  }
};

export const getImageById = async (req, res) => {
try {
  const image = await Image.findById(req.query.id);
  if (!image) return res.status(404).json({ message: 'Image not found' });
  // res.send(image);
  res.status(201).json({image});
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve an Image', error });
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
    res.status(400).json({ message: 'Failed to retrieve Images', error });
  }
}

export const updateImage = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    const existingImage = await Image.findById(id);

    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const album = await Album.findById(existingImage.album);

    if (!canManageAlbum(album, req.sessionUser)) {
      return res.status(403).json({ message: "You do not have permission to update this image." });
    }

    if (data.visibility === "public" && album.visibility !== "public") {
      return res.status(400).json({ message: "Image cannot be public until the album public approval is complete." });
    }

    data.updatedAt = new Date();
    const image = await Image.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    return res.status(200).json({image, message: 'Successfully updated Image'});

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
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const canView = album.visibility === "public"
      || req.sessionUser?.role === "admin"
      || album.owner?.toString() === req.sessionUser?.id
      || album.sharedWith?.some((userId) => userId.toString() === req.sessionUser?.id);

    if (!canView) {
      return res.status(req.sessionUser ? 403 : 401).json({ message: "You do not have access to this album." });
    }

    const images = await Image.find({ album: albumId}).sort({ sortOrder: 1, createdAt: -1 })

    if (!images) {
      return res.status(404).json({ message: 'Images not found' });
    }

    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({message: 'Failed to retrive images of the album'})
  }
}
