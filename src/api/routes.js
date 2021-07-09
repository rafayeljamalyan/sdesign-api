import dataRouter from './data';
import authRouter from './auth';

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
