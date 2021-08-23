const dataRouter = require('./data.js');
const authRouter = require('./auth.js');

module.exports = [
    {
        path:"/data",
        // needAuth: true,
        router: dataRouter
    },
    {
        path: "/auth",
        router: authRouter
    }
];
