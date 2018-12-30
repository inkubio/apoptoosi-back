
const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateRegisteration = (body) => {

    try {
        if (body.firstName.length > 125 || body.firstName.length <= 0) {
            return false;
        }
        else if(body.lastName.Length > 125 || body.firstName.length <= 0){
            return false;
        }
        else if (!validateEmail(body.email)){
            return false;
        }
        else if (body.seatingGroup.Length > 125) {
            return false;
        }
        else if (body.text.Length > 255) {
            return false;
        }
        return true;
    }
    catch(e) {
        return false;
    }

};

const validateEmail = (email) => {
    const valid = regex.test(String(email).toLowerCase());
    // console.log(my);
    return valid;
};

module.exports = validateRegisteration;