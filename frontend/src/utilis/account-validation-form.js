
// Registration Account validation form.
export function validateAccountForm(data) {
  const errors = {}

  if (!data) {
    return { isValid: false, errors }
  }

  const { username, contact, password, confirm_password } = data

  // Username Validation
  function usernameCheck() {
    const usernameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_]{4,16}$/

    if (!username || !username.trim()) {
      errors.username = "Username cannot be empty"
      return
    }

    if (!usernameRegex.test(username)) {
      errors.username =
        "Username must be 4-16 characters and contain only letters, numbers or _ (not numbers only)"
    }
  }

  // Contact Validation
  function contactCheck() {
    const contactRegex = /^[0-9]{10}$/

    if (!contact || !contact.trim()) {
      errors.contact = "Contact number cannot be empty"
      return
    }

    if (!contactRegex.test(contact)) {
      errors.contact = "Contact number must be exactly 10 digits."
    }
  }

  // Password Validation 
  function passwordCheck() {
    if (!password) {
      errors.password = "Password cannot be empty."
      return
    }

    if (password.length < 4 && password.length > 16) {
      errors.password = "Password must be at least 4-16 characters only."
    }
   
  }

 
  // Confirm Password Validation 
  function confirmPasswordCheck() {
    if (!confirm_password) {
      errors.confirm_password = "Please confirm your password"
      return
    }

    if (password !== confirm_password) {
      errors.confirm_password = "Passwords do not match"
    }
  }

  // Execute all validators
  usernameCheck()
  contactCheck()
  passwordCheck()
  confirmPasswordCheck()

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}