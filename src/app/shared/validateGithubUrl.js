const GITHUB_URL = 'https://www.github.com/';

module.exports = ValidateGithubURL = function( url ) {

  const regexUsernameValidation = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  const regexRepositoryValidation = /^[A-Za-z0-9_.-]{0,100}$/i;

  const gitHubPath = url.substring(0,23);
  const gitHubUser = url.substring(23, url.lastIndexOf('/'));
  const gitRepositoryName = url.substring(url.lastIndexOf('/') + 1);

  if ( gitHubPath !== GITHUB_URL ) {
    return {status: false, message: 'The github url is invalid'};
  }

  if( !regexUsernameValidation.test(gitHubUser) ){
    return { status: false, message: 'The github username is invalid!' };
  }

  if( !regexRepositoryValidation.test(gitRepositoryName) ) {
    return { stats: false, message: 'The github repository name is invalid' };
  }
  
  return { status: true, url: `${gitHubUser}/${gitRepositoryName}`};
}
