/**
 * 知识库相关类型定义
 */

/**
 * 知识库文档状态
 */
export enum DocumentStatus {
  DRAFT = 'draft', // 草稿
  PUBLISHED = 'published', // 已发布
  ARCHIVED = 'archived', // 已归档
  DELETED = 'deleted' // 已删除
}

/**
 * 文档类型
 */
export enum DocumentType {
  ARTICLE = 'article', // 文章
  FAQ = 'faq', // 常见问题
  TUTORIAL = 'tutorial', // 教程
  API_DOC = 'api_doc', // API文档
  CODE_SNIPPET = 'code_snippet', // 代码片段
  VIDEO = 'video', // 视频
  OTHER = 'other' // 其他
}

/**
 * 知识库分类
 */
export interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 知识库文档
 */
export interface KnowledgeBaseDocument {
  id: string;
  title: string;
  content: string;
  summary?: string;
  type: DocumentType;
  status: DocumentStatus;
  categoryId: string;
  tags: string[];
  authorId: string;
  authorName: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  isFeatured: boolean;
  isRecommended: boolean;
  seoKeywords?: string[];
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 文档搜索参数
 */
export interface DocumentSearchParams {
  keyword?: string;
  categoryId?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  authorId?: string;
  tag?: string;
  isFeatured?: boolean;
  isRecommended?: boolean;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 文档搜索响应
 */
export interface DocumentSearchResponse {
  documents: KnowledgeBaseDocument[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * 文档创建参数
 */
export interface DocumentCreateParams {
  title: string;
  content: string;
  summary?: string;
  type: DocumentType;
  categoryId: string;
  tags?: string[];
  seoKeywords?: string[];
  seoDescription?: string;
}

/**
 * 文档更新参数
 */
export interface DocumentUpdateParams {
  title?: string;
  content?: string;
  summary?: string;
  type?: DocumentType;
  categoryId?: string;
  tags?: string[];
  status?: DocumentStatus;
  seoKeywords?: string[];
  seoDescription?: string;
}

/**
 * 分类创建参数
 */
export interface CategoryCreateParams {
  name: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}

/**
 * 分类更新参数
 */
export interface CategoryUpdateParams {
  name?: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}

/**
 * 知识库Store状态
 */
export interface KnowledgeBaseStoreState {
  // 文档列表
  documents: KnowledgeBaseDocument[];
  // 当前文档
  currentDocument: KnowledgeBaseDocument | null;
  // 分类列表
  categories: KnowledgeBaseCategory[];
  // 当前分类
  currentCategory: KnowledgeBaseCategory | null;
  // 搜索参数
  searchParams: DocumentSearchParams;
  // 搜索结果
  searchResult: DocumentSearchResponse | null;
  // 加载状态
  loading: boolean;
  // 错误信息
  error: string | null;
}

/**
 * 知识库常用操作类型
 */
export interface KnowledgeBaseActions {
  // 搜索文档
  searchDocuments(params: DocumentSearchParams): Promise<DocumentSearchResponse>;
  // 获取文档详情
  getDocumentById(id: string): Promise<KnowledgeBaseDocument>;
  // 创建文档
  createDocument(params: DocumentCreateParams): Promise<KnowledgeBaseDocument>;
  // 更新文档
  updateDocument(id: string, params: DocumentUpdateParams): Promise<KnowledgeBaseDocument>;
  // 删除文档
  deleteDocument(id: string): Promise<void>;
  // 发布文档
  publishDocument(id: string): Promise<KnowledgeBaseDocument>;
  // 归档文档
  archiveDocument(id: string): Promise<KnowledgeBaseDocument>;
  // 获取分类列表
  getCategories(): Promise<KnowledgeBaseCategory[]>;
  // 获取分类详情
  getCategoryById(id: string): Promise<KnowledgeBaseCategory>;
  // 创建分类
  createCategory(params: CategoryCreateParams): Promise<KnowledgeBaseCategory>;
  // 更新分类
  updateCategory(id: string, params: CategoryUpdateParams): Promise<KnowledgeBaseCategory>;
  // 删除分类
  deleteCategory(id: string): Promise<void>;
  // 获取分类下的文档
  getDocumentsByCategory(categoryId: string, page?: number, size?: number): Promise<DocumentSearchResponse>;
  // 增加文档浏览量
  incrementViewCount(id: string): Promise<void>;
  // 点赞文档
  likeDocument(id: string): Promise<void>;
  // 取消点赞文档
  unlikeDocument(id: string): Promise<void>;
  // 收藏文档
  collectDocument(id: string): Promise<void>;
  // 取消收藏文档
  uncollectDocument(id: string): Promise<void>;
  // 设置推荐文档
  setFeaturedDocument(id: string, isFeatured: boolean): Promise<KnowledgeBaseDocument>;
  // 设置热门文档
  setRecommendedDocument(id: string, isRecommended: boolean): Promise<KnowledgeBaseDocument>;
  // 清除错误
  clearError(): void;
  // 重置状态
  reset(): void;
}