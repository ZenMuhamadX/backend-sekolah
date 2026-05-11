import { Hono } from 'hono';
import commonRoute from './routes/common.route';
const app = new Hono();
app.route('/', commonRoute);
export default app;
