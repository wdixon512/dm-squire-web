# My-Website

The official DM Squire website, built with NextJS, ChakraUI, and Firebase!

# Initial Setup

1. Clone the repo
2. From the repo's root, run `npm install`
3. Create a `.env.local` file, and add secrets
4. From the repo's root, run `npm run dev` to start development
5. Don't push anything to main. I have automated deployments set up on the `main` branch through Vercel. Make a PR

# Testing

1. Run `npm install`
2. Run `npm install -g firebase-tools`
3. Run `firebase login` to login to database
4. Run `firebase init emulators`. Choose Auth and Firestore emulators
5. Run `firebase emulators:start --only firestore`
6. Run `npm test` in another terminal tab

# Cypress Testing

1. Run `npx cypress open`
2. For tests that require checks against the database after some interaction, make sure your local .env file has the `SERVICE_ACCOUNT` entry in it. See https://www.npmjs.com/package/cypress-firebase setup for further instruction on what this .env entry should be set to (it's a JSON object, and has to be on 1 LINE).
3. You will also need to set `CYPRESS_FIREBASE_TEST_UID` to the UID for one of your google accounts.
4. If you are having connection issues with Firebase, you can run the `firebase-rtdb.cy.ts` file to help troubleshoot just firebase admin connection in a vaccuum.
5. RECOMMENDATION: use a different google account for cypress testing than what you use for testing while developing. All rooms tied to your cypress test account are deleted after each test run, which can be annoying when using one account.

# Upcoming Features

1. Mob Library
