# WebDr. - Emergency Doctor Finder

## Deployment Guide for Satisfyhost

### Project Overview
WebDr. is a MERN (MongoDB, Express, React, Node.js) application that helps users find emergency doctors. The application consists of:
- **Backend**: Node.js/Express API server
- **Frontend**: Next.js client application
- **Database**: MongoDB Atlas

### Prerequisites
- Node.js (v14+)
- NPM or Yarn
- MongoDB Atlas account
- Satisfyhost account with:
  - Node.js support
  - SSH access

### Deployment Steps

#### 1. Before Deployment

1. **Update Configuration Files**:
   - In `client/src/config/config.js`, replace `https://your-domain.com` with your actual domain.
   - In `app.js`, update the `allowedOrigins` array with your actual domain.
   - In `.env`, update `CLIENT_URL` with your actual domain.

2. **Build the Client**:
   ```bash
   cd client
   npm install
   npm run build
   ```

#### 2. Deploying to Satisfyhost

1. **Create a Node.js Hosting Account** on Satisfyhost.

2. **Upload Files**:
   - Upload all files to your hosting server using FTP or Satisfyhost's file manager.
   - Make sure to include the `client/.next` directory containing the build files.

3. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

4. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following content:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-domain.com
     PORT=5000
     ```

5. **Configure Domain**:
   - Point your domain to Satisfyhost's servers according to their documentation.
   - Set up SSL certificate for your domain (usually provided by Satisfyhost).

6. **Start the Server**:
   - For Satisfyhost, use their control panel to set up Node.js application.
   - Set the entry point to `app.js` or `index.cjs`
   - Set the Node.js version to a compatible version (14+ recommended)

7. **Set Up Process Manager**:
   - If available, use PM2 to manage your Node.js process:
     ```bash
     npm install -g pm2
     pm2 start app.js --name "webdr-api"
     ```

#### 3. Post-Deployment

1. **Test the API Endpoints**:
   - Verify that the API is working by accessing `https://your-domain.com/api`

2. **Monitor Logs**:
   - Monitor server logs for any errors:
     ```bash
     pm2 logs webdr-api
     ```

### Troubleshooting

1. **CORS Issues**:
   - Check that your domain is correctly added to the `allowedOrigins` array in `app.js`.
   - Ensure that CORS settings are properly configured in your hosting environment.

2. **MongoDB Connection Errors**:
   - Make sure your MongoDB Atlas IP whitelist includes your Satisfyhost server IP.
   - Verify that your MongoDB connection string in `src/config/config.js` is correct.

3. **Static File Serving**:
   - If images aren't loading, check the `upload-file` path configuration in `app.js`.

4. **Next.js Build Issues**:
   - Make sure the `.next` directory is properly uploaded to the server.
   - Check that environment variables are correctly set.

### Important Notes

- Remember to keep your MongoDB credentials secure.
- Regularly backup your database.
- Set up proper error logging for production environment.
- Consider using Satisfyhost's CDN for improved performance.

For any further assistance, contact Satisfyhost support or refer to their documentation. 