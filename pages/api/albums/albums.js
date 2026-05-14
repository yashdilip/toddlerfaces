import Album from '../../../models/album'
import { writeAuditLog } from '../../../lib/audit';

export const createAlbum = async (req, res) => {
  try {
    if (!req.sessionUser) {
      return res.status(401).json({ message: "Please sign in to create an album." });
    }

    const requestedVisibility = req.body.visibility === "public" ? "private" : req.body.visibility;
    const newAlbum = new Album({
      ...req.body,
      visibility: requestedVisibility || "private",
      owner: req.sessionUser.id,
      createdBy: req.body.createdBy || req.sessionUser.username || req.sessionUser.email,
      storageMode: "external_reference",
      publicApproval: req.body.visibility === "public" ? {
        status: "pending_email",
        requestedAt: new Date(),
        approvedByEmail: req.sessionUser.email,
        legalNoticeVersion: "public-sharing-disclaimer-v1",
      } : {
        status: "not_requested",
      },
      legalAudit: [
        {
          action: "album_created",
          actorRole: req.sessionUser.role,
          attestationVersion: "album-create-v1",
          acceptedAt: new Date(),
          ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
          userAgent: req.headers["user-agent"],
          sourceProvider: req.body.mediaProvider,
          sourceUrl: req.body.mediaSourceUrl,
        },
      ],
    });
    const album = await newAlbum.save();;
    await writeAuditLog(req, "album_created", {
      targetType: "album",
      targetId: album._id,
      album: album._id,
      metadata: {
        visibility: album.visibility,
        mediaProvider: album.mediaProvider,
        mediaSourceUrl: album.mediaSourceUrl,
      },
    });
    res.status(201).json({album, message: 'Successfully created album'});
  } catch (err) {
    res.status(400).json({ message: 'Could not create album', error: err });
  }
};

export const getAlbums = async (req, res) => {
  try {
    if (!req.sessionUser) {
      return res.status(200).json([]);
    }

    const query = req.sessionUser.role === "admin" ? {} : {
      $or: [
        { owner: req.sessionUser.id },
        { sharedWith: req.sessionUser.id },
      ],
    };

    const albums = await Album.find(query).sort({ createdAt: -1 });
    res.status(200).json(albums);
  } catch (err) {
    res.status(400).json({ message: 'Failed to retrieve Albums' });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.query.id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    if (album.visibility !== "public" && !req.sessionUser) {
      return res.status(401).json({ message: "Please sign in to view this album." });
    }

    const canView = album.visibility === "public"
      || req.sessionUser?.role === "admin"
      || album.owner?.toString() === req.sessionUser?.id
      || album.sharedWith?.some((userId) => userId.toString() === req.sessionUser?.id);

    if (!canView) {
      return res.status(403).json({ message: "You do not have access to this album." });
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
    delete data.__v

    if (!id) {
      return res.status(404).json({message: 'Album not selected'});
    }

    const existingAlbum = await Album.findById(id);

    if (!existingAlbum) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const canUpdate = req.sessionUser?.role === "admin" || existingAlbum.owner?.toString() === req.sessionUser?.id;

    if (!canUpdate) {
      return res.status(403).json({ message: "You do not have permission to update this album." });
    }

    if (data.visibility === "public" && existingAlbum.visibility !== "public") {
      data.visibility = existingAlbum.visibility || "private";
      data.publicApproval = {
        status: "pending_email",
        requestedAt: new Date(),
        approvedByEmail: req.sessionUser.email,
        legalNoticeVersion: "public-sharing-disclaimer-v1",
      };
    }

    data.updatedAt = new Date();

    const album = await Album.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    return res.status(200).json({album, message: 'Successfully updated Album'});
      
    } catch (err) {
      res.status(400).json({ message: 'Failed to update Album' });
    }
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.query;

  try {
    const existingAlbum = await Album.findById(id);

    if (!existingAlbum) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const canDelete = req.sessionUser?.role === "admin" || existingAlbum.owner?.toString() === req.sessionUser?.id;

    if (!canDelete) {
      return res.status(403).json({ message: "You do not have permission to delete this album." });
    }

    const album = await Album.findByIdAndDelete(id);

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
