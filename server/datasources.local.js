module.exports = {
  mongo: {
      host: process.env.MONGOHOST || "localhost",
      port: 27017,
      database: "workforce",
      name: "mongodb",
      connector: "mongodb"
    }
}
