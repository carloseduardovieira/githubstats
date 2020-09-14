const request = require('request');
const fs = require('fs');

class HtmlReader {

  githubUrl = 'https://www.github.com/';
  files = [];
  githubUsername;

  /**
  * This method will read all folders and files from the github repository
  * @param string[] urlArray
  */
  async readRepository ( urlArray ) {
    
    if ( !urlArray.length ) { return this.files; }

    const url = urlArray.pop();
    let filePath = await this.requestAndSaveHtml( `${this.githubUrl + url }` );
    const fileInfo = await this.getFileInformation(url, filePath);

    if ( fileInfo ) {
      // -- For debug
      // console.log('URL ARRAY', urlArray);
      // console.log('FILE INFO', fileInfo);
      // console.log('PROCESSED FILES COUNT', this.files.length);

      this.files.push(fileInfo);
      fs.unlinkSync(filePath);
      return await this.readRepository(urlArray);
    } else {
      const matches = await this.findFoldersAndFiles(filePath);
      if ( matches ) {
        const links = await this.extractLinks(matches);
        if ( links ) {
          urlArray = urlArray.concat(links);
        }
      }
      
      fs.unlinkSync(filePath);
      return await this.readRepository(urlArray);
    }
  }

  async requestAndSaveHtml ( url ) {
    if( !url || !this.githubUsername ) { return; }

    const filePath = `file${this.githubUsername + (this.files.length + 1)}.html`;

    return new Promise((resolve, reject) => {
      const createFile = fs.createWriteStream( filePath );

      createFile.on('close', () => {
        resolve(filePath);
      });

      createFile.on('error', () => {        
        reject('An unexpected error occurred while fetching the github html page');
      });

      request(url).pipe( createFile );
    });
  }

  async getFileInformation(url, filePath) {
    if(!url) { return; }

    return new Promise( (resolve, reject) => {
      fs.readFile(filePath, 'utf8', function ( error, html ) {
        if ( error || !html ) {
          reject('An unexpected error occurred while reading the github html page');
        }

        const patternLineInformation = /(\w+) lines/;
        const patternBytes = /file-info-divider\"><\/span>?.\s*([a-zA-Z0-9].[a-zA-Z0-9]*[\s]*[a-zA-Z]*)/;
        const patternFileWithoutLines = /([\s][0-9]{1,}[\s]{1,}[A-Z]{1,})[\s]/;
        const patternFileExtension = /[^\\]*\.(\w+)$/

        let lines = html.match(patternLineInformation);
        let bytes = html.match(patternBytes);
        const extension = url.match(patternFileExtension);

        if ( !bytes ) {
          bytes = html.match(patternFileWithoutLines);
          lines = [0,0];
        }

        if ( lines && bytes && extension ) {
          resolve({ lines: lines[1], bytes: bytes[1], extension: extension[1], name: url });
        } else {
          resolve(false);
        }
      });
    });
  }

  async findFoldersAndFiles(filePath) {
    
    return new Promise( (resolve, reject) => {
      fs.readFile(filePath, 'utf8', function ( error, html ) {
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