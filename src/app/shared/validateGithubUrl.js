const GITHUB_URL = 'https://www.github.com/';
const GITHUB_URL_2 = 'https://github.com/';

module.exports = ValidateGithubURL = function( url ) {

  if( !url ) { return false; }

  const patternUsernameValidation = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  const patternRepositoryValidation = /^[A-Za-z0-9_.-]{0,100}$/i;
  const patternUsername = /github.com\/(.*?)\//;

  const gitHubPath = url.substring(0,23);
  const gitHubPath2 = url.substring(0,19);
  const gitHubUser = url.match(patternUsername);
  const gitRepositoryName = url.substring(url.lastIndexOf('/') + 1);
  
  if ( (gitHubPath !== GITHUB_URL) && ( gitHubPath2 !== GITHUB_URL_2)  ) {
    return {status: false, message: 'The github url is invalid! Try https://github.com/username/repository'};
  }

  if( !gitHubUser || !patternUsernameValidation.test(gitHubUser[1]) ){
    return { status: false, message: 'The github username is invalid! Try https://github.com/username/repository' };
  }

  if( !patternRepositoryValidation.test(gitRepositoryName) ) {
    return { stats: false, message: 'The github repository name is invalid! Try https://github.com/username/repository' };
  }
  
  return { status: true, url: `${gitHubUser[1]}/${gitRepositoryName}`, gitHubUser: gitHubUser[1] };
}
