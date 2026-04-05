const fs = require('fs');
const { dirname } = require('path');
const path = require('path');

class LocalStorage {


  #fileDataJsonUrl;

  constructor(fileUrl = path.join(__dirname, '../data/data.json')) {
    this.data = {};
    this.#fileDataJsonUrl = fileUrl;
    this.#createFIleDataJson();
    this.data = this.#getData();
   
  }

  #createFIleDataJson() {
    
    if (!fs.existsSync(this.#fileDataJsonUrl)) {
      const dir = dirname(this.#fileDataJsonUrl);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.#fileDataJsonUrl, JSON.stringify(this.data));
    }
  }

  #getData() {
    const jsonData = JSON.parse(fs.readFileSync(this.#fileDataJsonUrl, 'utf-8'));
    return jsonData;
  }
  getItem(key) {
    return this.data[key] ?? null;
  }

  setItem(key, value) {
    this.data[key] = value;
    fs.writeFileSync(this.#fileDataJsonUrl, JSON.stringify(this.data));

  }

  removeItem(key) {
    delete this.data[key];
    fs.writeFileSync(this.#fileDataJsonUrl, JSON.stringify(this.data));
  }

  get length() {
    return Object.keys(this.data).length ?? 0;
  }

}

module.exports = new LocalStorage();