// article.interface.ts
export type TArticle = {
  title: string;
  authorName: string;
  authorDescription: string;
  productsType: string;
  content: Array<{ type: 'text' | 'image'; value: string; header: string; imageDescription?: string }>;
  tags: string[];
  isDeleted?: boolean; // Add soft delete field
};
