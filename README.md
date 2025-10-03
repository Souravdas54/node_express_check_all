1. I have perform schema validation using " Joi " and store all data & image to MongoDB.

2. I have validated the Image Format and Size using " Multer".

3. If the Register is successfully, the image will be stored in the uploads folder, if the Register fails, the image will not be stored in the uploads folder.

4. When a User or Admin Register with an Email-ID , an OTP will be sent to that Email-ID.The OTP will be used for verification. The OTP valid for 1 munites , if it expires , a new OTP must be user for verification and only then will the user able to Login. Otherwise , login will not be possible

5. The Admin will be able to access everything. For example - they will be able to CREATE , EDIT , UPDATE & DELETE Products.