const should = require('should');
const { validateVgPassword } = require('../../../lib/util/vg-password');

describe('util: vg-password', () => {
  it('should accept passwords meeting policy', () => {
    validateVgPassword('ValidPass!1').should.equal(true);
    validateVgPassword('Zy12!mnopqrst').should.equal(true);
  });

  it('should reject passwords that are too short', () => {
    validateVgPassword('Aa1!short').should.equal(false);
  });

  it('should require a special character', () => {
    validateVgPassword('NoSpecial123').should.equal(false);
  });

  it('should require an uppercase letter', () => {
    validateVgPassword('lowercase1!').should.equal(false);
  });

  it('should require a lowercase letter', () => {
    validateVgPassword('UPPERCASE1!').should.equal(false);
  });

  it('should require a digit', () => {
    validateVgPassword('NoDigitsHere!').should.equal(false);
  });
});
