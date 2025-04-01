export const fileUpload = (req, res) => {
  try {
    if (req.files.length > 0) {
      return res.status(200).json({
        status: true,
        file: req.files
      });
    } else {
      return res.status(200).json({ status: true });
    }
  } catch (e) {
    return { status: false, error: e };
  }
};
