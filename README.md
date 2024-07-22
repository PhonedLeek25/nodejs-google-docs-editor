# Node.js Google Docs Editor
Hello! I made this nodejs app to edit google docs.
A lot of the source code was from the following tutorial (https://dev.to/mcrowder65/creating-a-nodejs-script-that-can-write-to-google-docs-4hpk)
I mainly implemented a couple quality of life things and reduced the amount of steps needed.

0. run "npm i" to install all necessary (really only 1) package(s).
1. Go to https://console.cloud.google.com/apis/dashboard and enable Google Docs API and Gmail API.
2. Create Credentials from there and make sure to include the scope of seeing all doc files (docs.readonly or something like that).
 You will need to create a new file called credentials.json and store your new credentials there (or just renam the file you download from GCP).
3. Run Application with "node ." --> It'll give you a link to authorize your app. You should then be sent to a generic local host page.
 On this page (normal to say could not reach) you will find your token in the URL of the page between "code=" and "&scope"
 Grab this code and put it in the console!
 4. You're done, now you can run this app infiite amount of times to do your dirty bidding 0_0
