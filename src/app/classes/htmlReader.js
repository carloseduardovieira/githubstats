const request = require('request');
const fs = require('fs');

class HtmlReader {

  githubUrl = 'https://www.github.com/';
  jsonPath = 'temp/github.html';

  async readRepository ( url ) {
    url = 'carloseduardovieira/search/blob/master/.angulardoc.json';
    await this.requestAndSaveHtml( `${this.githubUrl + url}` );

    const fileInfo = await this.getFileInformation(url);

    if ( fileInfo ) {
      return fileInfo;
    } else {
      const matches = await this.findFoldersAndFiles();
      const links = await this.extractLinks(matches);
      return links;
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

    return new Promise( (resolve, reject) => {
      fs.readFile(this.jsonPath, 'utf8', function ( error, html ) {
        if ( error ) {
          reject('An unexpected error occurred while reading the github html page');
        }

        const patternLineInformation = /(\w+) lines/;
        const patternBytes = /(\w+) Bytes/;
        const patternFileExtension = /[^\\]*\.(\w+)$/

        const lines = html.match(patternLineInformation);
        const bytes = html.match(patternBytes);
        const extension = url.match(patternFileExtension);

        if ( lines && bytes && extension ) {
          resolve({ lines: lines[1], bytes: bytes[1], extension: extension[1], name: url });
          return;
        }

        reject('An unexpected error occurred while setting the file information');
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
        resolve(html.match(pattern));
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