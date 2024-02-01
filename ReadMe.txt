okay so in this twitter clone first you have to make your own env and fill in values and the 
variable for mongodb are DB_USERNAME, DB_PASSWORD.
than provide your code for the variable for this variable JWTCODE.


Ive used nodemailer to verify mail so you have to make google app password and keep email the same 
and provide it in these variable NODEMAILER_USER, NODEMAILER_PASS , make sure you do this or you wont 
be able to login in 

now comes cloudinary for storing files make your account in cloudinary and provide details in these 
variables CLOUD_NAME , CLOUD_API_KEY ,CLOUD_API_SECRET



1. Ive made authentication system involving protected routes with auth local storage .
2. Ater logging in the jwt is being stored in local stroage which on logout will be removed
3. And than after registering verify the email and than you can login 
4. in feed page you can tweet and post images which is being dtored in cloudinary 
5. Now you can also search people by clicking in side bar and search the user you want to follow or see
    his deatails of profile after following you can also see his tweets in your home feed page and like 
6. no password will be shown in browser console and no password can be seen by the database operator 
   cause of bycrypt
7.  Comments and retweet and likes is also possible
8. You can open peoples profile by clicking there profile picture 
9. You can update or delete your profile picture as well .
10. ive added extra features and yet to add more features and invested an extream amount of time 




