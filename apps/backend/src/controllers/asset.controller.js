const assetService = require("../services/asset.service");

const listAssets = async (_req, res, next) => {
  try {
    const response = await assetService.listAssets();
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const uploadAssets = async (req, res, next) => {
  try {
    const files = req.files || [];
    const userId = req.user?.userId;

    const uploads = await Promise.all(
      files.map((file) => assetService.uploadAsset({ file, userId }))
    );

    res.json({
      success: true,
      message: "Assets uploaded successfully",
      data: uploads,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const response = await assetService.deleteAsset({
      assetId: req.params.assetId,
      userId: req.user?.userId,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listAssets,
  deleteAsset,
  uploadAssets,
};
