module.exports = {
  host: process.env.DBHOST || 'localhost',
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || 'bolttake3',
  database: process.env.DBDB || 'uvto',
  secret: process.env.SECRET || 'b39b4f7392fv3972f4b397fb973vf2943'
}
