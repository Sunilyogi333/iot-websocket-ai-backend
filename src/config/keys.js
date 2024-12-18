export default {
    app: {
        name: "Khukhuri Kaa",
        apiURL: process.env.BASE_API_URL,
        clientURL: process.env.CLIENT_URL,
    },

    port: process.env.PORT || 5000,

    NODE_ENV: process.env.NODE_ENV,

    database: {
        url: process.env.MONGODB_URL,
        name: process.env.DB_NAME,
    }
}