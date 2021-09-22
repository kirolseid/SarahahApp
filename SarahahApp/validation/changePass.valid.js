const {check} = require('express-validator');

module.exports=[
   
    check('newPass').isStrongPassword(),
    check('confirnNewPass').custom((value, { req }) => {
        if (value !== req.body.newPass) {
            return false;
        }
            return true;
        }),
]

//{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }

