const request = require('request');
const fs = require('fs');

class HtmlReader {


  async requestAndSaveHtml ( url, jsonPath ) {
    if( !url || !jsonPath ) { return; }

    return new Promise((resolve, reject) => {
      const createFile = fs.createWriteStream(jsonPath);

      createFile.on('close', () => {
        resolve(jsonPath);
      });

      createFile.on('error', () => {
        reject('An unexpected error occurred while fetching the github html page');
      });

      request(url).pipe( createFile );
    });
  }

  async extractFolders( filePath ) {
    if( !filePath ) { return };

    return new Promise( (resolve, reject) => {
      fs.readFile(filePath, 'utf8', function ( error, html ) {
        if ( error ) {
          reject('An unexpected error occurred while reading the github html page');
        }
        
        const pattern = /<a class=\"js-navigation-open link-gray-dark\"(.*?)<\/a>/g;
        const matches = html.match(pattern);
        // const matches = pattern.exec(html);
        // const result = matches[0];
        // console.log(result);
        resolve(matches);
      });
    });
  }

  // extractFolders = function( filePath ) {
  //   if( !filePath ) { return };

  //   return new Observable( ( subscriber ) => {
  //     fs.readFile(filePath, 'utf8', function ( error, html ) {
  //       if ( error ) {
  //         subscriber.error('An unexpected error occurred while reading the github html page');
  //         subscriber.complete();
  //       }

  //       subscriber.next(html);
  //       subscriber.complete();
  //     });
  //   });
  // }

}

module.exports = new HtmlReader();