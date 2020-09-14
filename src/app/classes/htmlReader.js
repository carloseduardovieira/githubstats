const request = require('request');
const fs = require('fs');

class HtmlReader {

  githubUrl = 'https://www.github.com/';
  jsonPath = 'temp/github.html';
  files = [];

  async readRepository ( filesArray ) {

    if ( !filesArray.length ) { return this.files; }

    const url = filesArray.pop();
    await this.requestAndSaveHtml( `${this.githubUrl + url }` );
    const fileInfo = await this.getFileInformation(url);
    
    if ( fileInfo ) {
      console.log('FILE INFO', fileInfo);
      console.log('FILE ARRAY', filesArray);
      this.files.push(fileInfo);

      fs.unlinkSync(this.jsonPath);
      this.readRepository(filesArray);

    } else {
      const matches = await this.findFoldersAndFiles();
      if ( matches ) {
        const links = await this.extractLinks(matches);
        if ( links ) {
          filesArray = filesArray.concat(links);
        }
      }
      
      fs.unlinkSync(this.jsonPath);
      this.readRepository(filesArray);
    }
  }

  async requestAndSaveHtml ( url ) {
    if( !url ) { return; }

    return new Promise((resolve, reject) => {
      const createFile = fs.createWriteStream(this.jsonPath);

      createFile.on('close', () => {
        resolve(true);
      });

      createFile.on('error', () => {        
        reject('An unexpected error occurred while fetching the github html page');
      });

      request(url).pipe( createFile );
    });
  }

  async getFileInformation(url) {
    if(!url) { return; }

    return new Promise( (resolve, reject) => {
      fs.readFile(this.jsonPath, 'utf8', function ( error, html ) {
        if ( error ) {
          reject('An unexpected error occurred while reading the github html page');
        }

        const patternLineInformation = /(\w+) lines/;
        const patternBytes = /file-info-divider\"><\/span>?.\s*([a-zA-Z0-9].[a-zA-Z0-9]*[\s]*[a-zA-Z]*)/;
        const patternFileExtension = /[^\\]*\.(\w+)$/

        const lines = html.match(patternLineInformation);
        const bytes = html.match(patternBytes);
        const extension = url.match(patternFileExtension);

        if ( lines && bytes && extension ) {
          resolve({ lines: lines[1], bytes: bytes[1], extension: extension[1], name: url });
        } else {
          resolve(false);
        }
      });
    });
  }

  async findFoldersAndFiles() {
    
    return new Promise( (resolve, reject) => {
      fs.readFile(this.jsonPath, 'utf8', function ( error, html ) {
        if ( error ) {
          reject('An unexpected error occurred while reading the github html page');
        }

        const pattern = /<a class=\"js-navigation-open link-gray-dark\"(.*?)<\/a>/g;
        const matches = html.match(pattern);

        if ( matches ) {
          resolve(matches);
          return;
        } 

        resolve(false);
      });
    });
  }

  async extractLinks( matches ) {
    if ( !matches ) { return; }

    const pattern = /href="\/(.*?)"/;

    return new Promise( (resolve ) => {
      matches = matches.map( (html) => {
        const match = html.match( pattern );
        if ( match ) {
          return match[1];
        }
        return null;
      });

      resolve(matches);
    });
  }
}

module.exports = new HtmlReader();