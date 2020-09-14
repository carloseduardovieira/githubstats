const validateUrl = require('../../src/app/shared/validateGithubUrl');

describe('Validate GitHub Url', () => { 

  it('should return error message if github url is wrong', () => {
    const validation = validateUrl('https://www.nytimes.com/');
    expect(validation.status).toBeFalsy();
    expect(validation.message).toEqual('The github url is invalid! Try https://github.com/username/repository');
  });

  it('should return error message if username is invalid', () => {
    const validation = validateUrl('https://github.com/carloseduardovieir@/conexao-php-pdo');
    expect(validation.status).toBeFalsy();
    expect(validation.message).toEqual('The github username is invalid! Try https://github.com/username/repository');
  })

  it('should return error message if the github repository is invalid', () => {
    const validation = validateUrl('https://github.com/carloseduardovieira/conex@ophp-pdo');
    expect(validation.status).toBeFalsy();
    expect(validation.message).toEqual('The github repository name is invalid! Try https://github.com/username/repository');
  });

  it('must return username / repository if url is correct', () => {
    const validation = validateUrl('https://github.com/carloseduardovieira/conexao-php-pdo');
    expect(validation.status).toBeTruthy();
    expect(validation.url).toEqual('carloseduardovieira/conexao-php-pdo');
  });
});