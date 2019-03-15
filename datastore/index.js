const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw 'error writing counter';
        } else {
          callback(null, { id, text });
        }
      });
      // items[id] = text;
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, fileNamesArr) => {
    if (err) {
      console.log(err);
    } else {
      fileNamesArr.forEach((item) => {
        let id = item.slice(0, item.length - 4);
        data.push({
          id: id,
          text: id,
        });
      });
      callback(null, data);
    }
  });
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      // console.log(err);
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {
        id: id,
        text: `${fileData}`,
      });
    }
    // var text;
    // if (!text) {
    // } else {
    //   callback(null, { id, text });
    // }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, fileNamesArr) => {
    if (err) {
      console.log(err);
    } else {
      fileNamesArr.forEach((item, index) => {
        var fileId = item.slice(0, item.length - 4);
        if (fileId === id) {
          fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
            if (err) {
              // console.log(err);
              callback(new Error(`No item with id: ${id}`));
            } else {
              callback(null, { id, text });
            }
          });
        } else if (fileId !== id && index === fileNamesArr.length - 1) {
          callback(new Error(`No item with id: ${id}`));
        }
      });
      // callback(null, { id, text });
      // callback(null, data);
    }
  });
};

exports.delete = (id, callback) => {
  fs.readdir(exports.dataDir, (err, fileNamesArr) => {
    if (err) {
      console.log(err);
    } else {
      fileNamesArr.forEach((item, index) => {
        var fileId = item.slice(0, item.length - 4);
        if (fileId === id) {
          fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
            if (err) {
              // console.log(err);
              callback(new Error(`No item with id: ${id}`));
            } else {
              callback();
            }
          });
        } else if (fileId !== id && index === fileNamesArr.length - 1) {
          callback(new Error(`No item with id: ${id}`));
        }
      });
      // callback(null, { id, text });
      // callback(null, data);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
