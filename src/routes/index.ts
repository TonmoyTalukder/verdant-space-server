import { Router } from 'express';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/order/order.route';
import { UserRoutes } from '../modules/user/user.route';
import { ArticleRoutes } from '../modules/article/article.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/articles',
    route: ArticleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
