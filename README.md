# VerdantSpace

## Introduction

VerdantSpace is a platform that helps you to create and connect eco-friendly spaces. VerdantSpace offers a diverse selection of plants to suit various needs and preferences. You can find flowering plants that add vibrant colors to your space, fruit plants that bring fresh produce right to your home, and home decor plants that enhance the aesthetic appeal of your living environment. Additionally, we offer herbs for culinary and medicinal purposes, as well as wood plants that provide a rustic charm. We are also excited to expand our offerings to include seeds in the near future, allowing you to start your own garden from scratch.

## Project Description

The project is an online nursery website using React, Redux, Node.js, and Express.js. The website will allow users to browse, filter, and search for products, add products to their cart, and make online payments via Stripe.js. Additionally, there will be a product and category management section for CRUD operations.

## Features
- CRUD and Search Operation for User
- CRUD and Search Operation for Product
- CRUD and Search Operation for Order
- CRUD and Search Operation for Article

## Technology Stack

- Node Js
- Express Js
- MongoDB
- TypeScript

## Installation Guideline

### Installation Steps

1. npm install
2. npm run lint
3. npm run prettier
4. npm run build
5. npm run start:prod

### Configuration

1. Create a `.env` file in the root directory of the project.
2. Add necessary configuration variables in the `.env` file.
   Example:
   ```bash
    NODE_ENV=development
    PORT=5000
    DB_URL=your_db_connection_uri
    BCRYPT_SALT_ROUNDS=12
    DEFAULT_PASS=your_password
    JWT_ACCESS_SECRET = your_jwt_access_token_here
    JWT_REFRESH_SECRET = your_jwt_refress_token_here
    JWT_ACCESS_EXPIRES_IN=5s
    JWT_REFRESH_EXPIRES_IN=7d
    RESET_PASS_UI_LINK=http://localhost:3000/
    CLOUDINARY_CLOUD_NAME=put_your_coudinary_cloud_name
    CLOUDINARY_API_KEY=put_your_coudinary_api_key
    CLOUDINARY_API_SECRET=put_your_coudinary_api_secret
    SUPER_ADMIN_PASSWORD=super_admin_password
   ```
