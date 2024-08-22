import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    console.log("Database connected successfully."); 

    app.listen(config.port, () => {
      console.log(`Express app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
