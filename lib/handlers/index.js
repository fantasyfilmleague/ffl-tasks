var fs = require('fs');
var path = require('path');

function requireByDirectory(source, directory, target, validFileExtensions) {
  var files = fs.readdirSync(directory);

  validFileExtensions = validFileExtensions || ['.js'];

  files.forEach(function (file) {
    var ext = path.extname(file);

    // if this is not a file type we recognize skip it
    if (validFileExtensions.indexOf(ext) < 0) {
      return;
    }

    var fullPath = path.join(directory, file);

    // if this is this file then skip it
    if (fullPath === source) {
      return;
    }

    var name = path.basename(file, ext);

    target[name] = require(fullPath);
  });
};

requireByDirectory(__filename, __dirname, exports);
