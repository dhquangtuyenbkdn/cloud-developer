export const config = {
  "postgres": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "host": process.env.POSTGRES_HOST,
    "database": process.env.POSTGRES_DATABASE,
    "dialect": "postgres",
  },
  "jwt": {
    "secret": process.env.JWT_SECRET,
    "expiresIn": process.env.JWT_EXPIRES_IN,
  },
  "hash": {
    "saltRounds": Number(process.env.KEY_SALT_ROUNDS)
  },
  "aws": {
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "aws_accessKeyAccess": process.env.AWS_SECRET_ACCESS_KEY,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  }
}
