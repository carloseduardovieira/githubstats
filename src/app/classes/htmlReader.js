const request = require('request');

class HtmlReader {

  githubUrl = 'https://www.github.com/';
  files = [];

  //regex patterns
  patternLineInformation = /(\w+) lines/;
  patternBytes = /file-info-divider\"><\/span>?.\s*([a-zA-Z0-9].[a-zA-Z0-9]*[\s]*[a-zA-Z]*)/;
  patternFileWithoutLines = /([\s][0-9]{1,}[\s]{1,}[A-Z]{1,})[\s]/;
  patternFileExtension = /[^\\]*\.(\w+)$/;
  patternRepositoryLines = /<a class=\"js-navigation-open link-gray-dark\"(.*?)<\/a>/g;
  patternLinks = /href="\/(.*?)"/;

  /**
  * This method will read all folders and files from the github repository
  * @param string[] urlArray
  */
  async readRepository ( urlArray ) {
    
    if ( !urlArray.length ) { return this.files; }

    const url = urlArray.pop();
    const html = await this.requestHtml( `${this.githubUrl + url }` );
    const fileInfo = await this.getFileInformation(url, html);
    
    if ( fileInfo ) {
      // -- For debug
      console.log('URL ARRAY', urlArray);
      console.log('FILE INFO', fileInfo);
      console.log('PROCESSED FILES COUNT', this.files.length);

      this.files.push(fileInfo);
      return await this.readRepository(urlArray);
    } else {
      const matches = await this.findFoldersAndFiles(html);
      if ( matches ) {
        const links = await this.extractLinks(matches);
        if ( links ) {
          urlArray = urlArray.concat(links);
        }
      }
      
      return await this.readRepository(urlArray);
    }
  }

  async requestHtml ( url ) {
    if( !url ) { return; }

    return new Promise((resolve, reject) => {
      return request(url, (error, response, body) => {
        if ( error ) {
          reject(error);
        }

        resolve(body);
      });
    });
  }

  async getFileInformation(url, html) {

    if( !url || !html ) { return; }

    return new Promise( ( resolve ) => {

      let lines = html.match(this.patternLineInformation);
      let bytes = html.match(this.patternBytes);
      const extension = url.match(this.patternFileExtension);

      if ( !bytes ) {
        bytes = html.match(this.patternFileWithoutLines);
        lines = [0,0];
      }

      if ( lines && bytes && extension ) {
        resolve({ lines: lines[1], bytes: bytes[1], extension: extension[1], name: url });
      } else {
        resolve(false);
      }

    });
  }

  async findFoldersAndFiles(html) {
    if( !html ) { return; }

    return new Promise( (resolve) => {
      
      const matches = html.match(this.patternRepositoryLines);

      if ( matches ) {
        resolve(matches);
        return;
      } 

      resolve(false);
    });
  }

  async extractLinks( matches ) {
    if ( !matches ) { return; }
    
    return new Promise( (resolve ) => {
      matches = matches.map( ( lines ) => {
        const match = lines.match( this.patternLinks );
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