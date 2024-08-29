// article.controller.ts
import { Request, Response } from 'express';
import { ArticleServices } from './article.service';

const createArticle = async (req: Request, res: Response) => {
  const articleData = req.body;
  try {
    const result = await ArticleServices.createArticle(articleData);
    res.status(201).json({
      success: true,
      message: 'Article created successfully!',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not create article!',
      });
    }
  }
};

const getAllArticles = async (req: Request, res: Response) => {
  try {
    const result = await ArticleServices.getAllArticles();
    res.status(200).json({
      success: true,
      message: 'Articles fetched successfully!',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not fetch articles!',
      });
    }
  }
};

const getArticleById = async (req: Request, res: Response) => {
  try {
    const { articleID } = req.params;
    const result = await ArticleServices.getArticleById(articleID);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Article by ID fetched successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Article not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not fetch article!',
      });
    }
  }
};

const updateArticle = async (req: Request, res: Response) => {
  try {
    const { articleID } = req.params;
    const articleData = req.body;
    const result = await ArticleServices.updateArticle(articleID, articleData);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Article updated successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Article not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not update article!',
      });
    }
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { articleID } = req.params;
    const result = await ArticleServices.deleteArticle(articleID);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Article deleted successfully (soft deleted)!',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Article not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not delete article!',
      });
    }
  }
};

export const ArticleControllers = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
