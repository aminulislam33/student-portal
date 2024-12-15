const otpGenerator = require('otp-generator');

const generateOTP = (length = 6, useDigits = true, useUpperCase = false, useLowerCase = false, useSpecialChars = false) => {
  if (length < 4 || length > 8) {
    throw new Error('OTP length must be between 4 and 8 characters');
  }

  const OTP = otpGenerator.generate(length, {
    digits: useDigits,
    upperCaseAlphabets: useUpperCase,
    lowerCaseAlphabets: useLowerCase,
    specialChars: useSpecialChars,
  });

  return OTP;
};

module.exports = generateOTP;