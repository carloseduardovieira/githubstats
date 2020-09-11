const { Stats } = require('../../src/app/models');

describe('Register', () => {

  it('should create user', async () => {
    const stats = await Stats.create({
      name: 'file1',
      extension: 'json',
      lines: '1045',
      bytes: '2020' 
    });

    expect(stats.name).toBe('file1');
  });

});
