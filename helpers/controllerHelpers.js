module.exports = {
  escapeRegex: text => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  },
  uploadFileGetUrl: async (file, bucket) => {
    let imageUrl;
    const MIME_TYPES = {
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'image/jpg': 'jpg'
    };
    const isValid = MIME_TYPES[file.mimetype];
    if (!isValid) {
      return false;
    }
    const fileName =
      file.fieldname +
      '-' +
      file.originalname
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    let fileUpload = bucket.file(fileName);
    await fileUpload.save(new Buffer(file.buffer)).then(
      result => {
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${fileName}?alt=media`;
      },
      error => {
        console.log('TCL: uploadFileandGetURL -> error', error);
        return false;
      }
    );
    return imageUrl;
  }
};
