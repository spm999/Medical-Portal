//Password strength function
function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
    if (password.length < minLength) {
      return 'Password should be at least 8 characters long.';
    }
  
    if (!hasUpperCase) {
      return 'Password should contain at least one uppercase letter.';
    }
  
    if (!hasLowerCase) {
      return 'Password should contain at least one lowercase letter.';
    }
  
    if (!hasDigit) {
      return 'Password should contain at least one digit.';
    }
  
    if (!hasSpecialChar) {
      return 'Password should contain at least one special character.';
    }
  
    return 'strong'; // Password meets all criteria
  }
  

  module.exports=checkPasswordStrength