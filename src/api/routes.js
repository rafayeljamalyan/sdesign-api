import dataRouter from './data.js';
import authRouter from './auth.js';

export default [
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
