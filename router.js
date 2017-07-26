import * as usr from './controllers/user';

const router = (app) => {
    /**
     * User API
     */
    app.put('/api/user', usr.add);
    app.post('/api/user', usr.update);
    app.patch('/api/user', usr.remove);
    app.get('/api/user', usr.user);
    app.get('/api/users', usr.users);
};

export default router;