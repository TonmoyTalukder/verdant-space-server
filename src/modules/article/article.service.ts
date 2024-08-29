// article.service.ts
import { TArticle } from './article.interface';
import { Article } from './article.model';

const createArticle = async (payload: TArticle) => {
  const result = await Article.create(payload);
  return result;
};

const getAllArticles = async () => {
  const result = await Article.find({ isDeleted: false }); // Only get non-deleted articles
  return result;
};

const getArticleById = async (id: string) => {
  const result = await Article.findOne({ _id: id, isDeleted: false }); // Exclude deleted articles
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
};

const updateArticle = async (id: string, payload: Partial<TArticle>) => {
  const result = await Article.findOneAndUpdate(
    { _id: id, isDeleted: false }, // Only update if not deleted
    payload,
    { new: true },
  );
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
};

const deleteArticle = async (id: string) => {
  const result = await Article.findOneAndUpdate(
    { _id: id }, // Find by ID regardless of deletion status
    { isDeleted: true }, // Mark the article as deleted
    { new: true },
  );
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
};

export const ArticleServices = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
