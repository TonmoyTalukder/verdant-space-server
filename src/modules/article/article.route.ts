// article.route.ts
import express from 'express';
import { ArticleControllers } from './article.controller';
import { createArticleSchema, updateArticleSchema } from './article.validation';
import validate from '../../middleware/middleware.validation';

const router = express.Router();

// Routes
router.post('/', validate(createArticleSchema), ArticleControllers.createArticle);
router.get('/:articleID', ArticleControllers.getArticleById);
router.get('/', ArticleControllers.getAllArticles);
router.put('/:articleID', validate(updateArticleSchema), ArticleControllers.updateArticle);
router.delete('/:articleID', ArticleControllers.deleteArticle);

export const ArticleRoutes = router;
