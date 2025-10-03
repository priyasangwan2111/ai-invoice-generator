export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email) return "email is required"
    if(!emailRegex.test(email)) return "Invalid email format"
    return ""
};


export const validatePassword=(password) => {
    if(!password) return "password is required"
    if(password.length < 6) return "password should be at least 6 characters long"
   
    return ""
}