# MongoDB & Render Deployment Guide for Boss Tours & Travels

Follow these simple steps to deploy your backend to **Render** and connect your database to **MongoDB Atlas**.

---

## 🛠️ Step 1: Set Up Free MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Deployment** & choose the **M0 Free Cluster**.
3. Under **Database Access**, create a database user (e.g. `admin` and a strong password).
4. Under **Network Access**, click **Add IP Address** & choose **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Click **Connect** & select **Drivers (Node.js)** to get your Connection String:
   ```text
   mongodb+srv://admin:<password>@cluster0.mongodb.net/bosstours?retryWrites=true&w=majority
   ```

---

## 🚀 Step 2: Seed MongoDB Database
On your local computer, set your MongoDB URI in `server/.env`:
```env
MONGODB_URI=mongodb+srv://admin:<password>@cluster0.mongodb.net/bosstours?retryWrites=true&w=majority
```
Then run the MongoDB seed script:
```bash
cd server
npm run seed:mongo
```
*This initializes all 5 fleet cars, 6 tour packages, 10 outstation routes, sample bookings, and the Super Admin account (`admin@bosstours.com` / `admin123`).*

---

## ☁️ Step 3: Deploy Backend on Render

1. Push your project code to GitHub or GitLab.
2. Log in to [Render.com](https://render.com).
3. Click **New +** & select **Web Service**.
4. Connect your GitHub repository.
5. Set the following settings:
   - **Name**: `bosstours-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Scroll to **Environment Variables** & add:
   - `MONGODB_URI`: `mongodb+srv://admin:<password>@cluster0.mongodb.net/bosstours?retryWrites=true&w=majority`
   - `JWT_SECRET`: `bosstours_secret_key_2026_luxury_travel`
   - `PORT`: `10000`
7. Click **Create Web Service**.

Render will build and deploy your Node.js + MongoDB API at `https://bosstours-backend.onrender.com`!

---

## 🔑 Default Admin Account
- **Email**: `admin@bosstours.com`
- **Password**: `admin123`
