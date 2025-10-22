import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  DocumentType,
  DocumentStatus
} from './types';
import type { 
  KnowledgeBaseDocument,
  KnowledgeBaseCategory,
  DocumentSearchParams,
  DocumentSearchResponse,
  DocumentCreateParams,
  DocumentUpdateParams,
  CategoryCreateParams,
  CategoryUpdateParams
} from './types';

/**
 * 知识库Store
 */
export const useKnowledgeBaseStore = defineStore('knowledgebase', () => {
  // State
  const documents = ref<KnowledgeBaseDocument[]>([]);
  const currentDocument = ref<KnowledgeBaseDocument | null>(null);
  const categories = ref<KnowledgeBaseCategory[]>([]);
  const currentCategory = ref<KnowledgeBaseCategory | null>(null);
  const searchParams = ref<DocumentSearchParams>({
    page: 1,
    size: 10
  });
  const searchResult = ref<DocumentSearchResponse | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const getDocuments = computed(() => documents.value);
  const getCurrentDocument = computed(() => currentDocument.value);
  const getCurrentCategory = computed(() => currentCategory.value);
  const getSearchParams = computed(() => searchParams.value);
  const getSearchResult = computed(() => searchResult.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // Actions
  const searchDocuments = async (params: DocumentSearchParams): Promise<DocumentSearchResponse> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.searchDocuments(params);
      const mockResponse: DocumentSearchResponse = {
        documents: [],
        total: 0,
        page: params.page,
        size: params.size,
        totalPages: 0
      };
      
      searchParams.value = params;
      searchResult.value = mockResponse;
      documents.value = mockResponse.documents;
      
      return mockResponse;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索文档失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getDocumentById = async (id: string): Promise<KnowledgeBaseDocument> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.getDocumentById(id);
      const mockDocument: KnowledgeBaseDocument = {
        id,
        title: '示例文档',
        content: '这是示例文档内容',
        type: DocumentType.ARTICLE,
        status: DocumentStatus.PUBLISHED,
        categoryId: '1',
        tags: ['示例', '文档'],
        authorId: '1',
        authorName: '管理员',
        viewCount: 100,
        likeCount: 10,
        collectCount: 5,
        isFeatured: false,
        isRecommended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      currentDocument.value = mockDocument;
      return mockDocument;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取文档详情失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createDocument = async (params: DocumentCreateParams): Promise<KnowledgeBaseDocument> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.createDocument(params);
      const newDocument: KnowledgeBaseDocument = {
        id: Date.now().toString(),
        ...params,
        status: DocumentStatus.DRAFT,
        tags: params.tags || [],
        authorId: 'current-user-id',
        authorName: '当前用户',
        viewCount: 0,
        likeCount: 0,
        collectCount: 0,
        isFeatured: false,
        isRecommended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      documents.value.unshift(newDocument);
      currentDocument.value = newDocument;
      
      return newDocument;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建文档失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDocument = async (id: string, params: DocumentUpdateParams): Promise<KnowledgeBaseDocument> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.updateDocument(id, params);
      const documentIndex = documents.value.findIndex(doc => doc.id === id);
      if (documentIndex === -1) {
        throw new Error('文档不存在');
      }
      
      const updatedDocument = {
        ...documents.value[documentIndex],
        ...params,
        updatedAt: new Date().toISOString()
      };
      
      documents.value[documentIndex] = updatedDocument;
      if (currentDocument.value?.id === id) {
        currentDocument.value = updatedDocument;
      }
      
      return updatedDocument;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新文档失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.deleteDocument(id);
      const documentIndex = documents.value.findIndex(doc => doc.id === id);
      if (documentIndex === -1) {
        throw new Error('文档不存在');
      }
      
      documents.value.splice(documentIndex, 1);
      if (currentDocument.value?.id === id) {
        currentDocument.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除文档失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const publishDocument = async (id: string): Promise<KnowledgeBaseDocument> => {
    return updateDocument(id, { status: DocumentStatus.PUBLISHED });
  };

  const archiveDocument = async (id: string): Promise<KnowledgeBaseDocument> => {
    return updateDocument(id, { status: DocumentStatus.ARCHIVED });
  };

  const fetchCategories = async (): Promise<KnowledgeBaseCategory[]> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.getCategories();
      const mockCategories: KnowledgeBaseCategory[] = [
        {
          id: '1',
          name: '技术文档',
          description: '技术相关的文档',
          sortOrder: 1,
          documentCount: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '产品文档',
          description: '产品相关的文档',
          sortOrder: 2,
          documentCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      categories.value = mockCategories;
      return mockCategories;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取分类列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getCategoryById = async (id: string): Promise<KnowledgeBaseCategory> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.getCategoryById(id);
      const category = categories.value.find(cat => cat.id === id);
      if (!category) {
        throw new Error('分类不存在');
      }
      
      currentCategory.value = category;
      return category;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取分类详情失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (params: CategoryCreateParams): Promise<KnowledgeBaseCategory> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.createCategory(params);
      const newCategory: KnowledgeBaseCategory = {
        id: Date.now().toString(),
        ...params,
        sortOrder: params.sortOrder || 0,
        documentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      categories.value.push(newCategory);
      return newCategory;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建分类失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: string, params: CategoryUpdateParams): Promise<KnowledgeBaseCategory> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // const response = await knowledgeBaseApi.updateCategory(id, params);
      const categoryIndex = categories.value.findIndex(cat => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error('分类不存在');
      }
      
      const updatedCategory = {
        ...categories.value[categoryIndex],
        ...params,
        updatedAt: new Date().toISOString()
      };
      
      categories.value[categoryIndex] = updatedCategory;
      if (currentCategory.value?.id === id) {
        currentCategory.value = updatedCategory;
      }
      
      return updatedCategory;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新分类失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.deleteCategory(id);
      const categoryIndex = categories.value.findIndex(cat => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error('分类不存在');
      }
      
      categories.value.splice(categoryIndex, 1);
      if (currentCategory.value?.id === id) {
        currentCategory.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除分类失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getDocumentsByCategory = async (categoryId: string, page: number = 1, size: number = 10): Promise<DocumentSearchResponse> => {
    return searchDocuments({
      categoryId,
      page,
      size
    });
  };

  const incrementViewCount = async (id: string): Promise<void> => {
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.incrementViewCount(id);
      const document = documents.value.find(doc => doc.id === id);
      if (document) {
        document.viewCount++;
        if (currentDocument.value?.id === id) {
          currentDocument.value.viewCount++;
        }
      }
    } catch (err) {
      console.error('增加浏览量失败:', err);
    }
  };

  const likeDocument = async (id: string): Promise<void> => {
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.likeDocument(id);
      const document = documents.value.find(doc => doc.id === id);
      if (document) {
        document.likeCount++;
        if (currentDocument.value?.id === id) {
          currentDocument.value.likeCount++;
        }
      }
    } catch (err) {
      console.error('点赞文档失败:', err);
    }
  };

  const unlikeDocument = async (id: string): Promise<void> => {
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.unlikeDocument(id);
      const document = documents.value.find(doc => doc.id === id);
      if (document && document.likeCount > 0) {
        document.likeCount--;
        if (currentDocument.value?.id === id) {
          currentDocument.value.likeCount--;
        }
      }
    } catch (err) {
      console.error('取消点赞失败:', err);
    }
  };

  const collectDocument = async (id: string): Promise<void> => {
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.collectDocument(id);
      const document = documents.value.find(doc => doc.id === id);
      if (document) {
        document.collectCount++;
        if (currentDocument.value?.id === id) {
          currentDocument.value.collectCount++;
        }
      }
    } catch (err) {
      console.error('收藏文档失败:', err);
    }
  };

  const uncollectDocument = async (id: string): Promise<void> => {
    try {
      // 这里应该调用实际的API
      // await knowledgeBaseApi.uncollectDocument(id);
      const document = documents.value.find(doc => doc.id === id);
      if (document && document.collectCount > 0) {
        document.collectCount--;
        if (currentDocument.value?.id === id) {
          currentDocument.value.collectCount--;
        }
      }
    } catch (err) {
      console.error('取消收藏失败:', err);
    }
  };

  const setFeaturedDocument = async (id: string, isFeatured: boolean): Promise<KnowledgeBaseDocument> => {
    const document = documents.value.find(doc => doc.id === id);
    if (!document) {
      throw new Error('文档不存在');
    }
    
    document.isFeatured = isFeatured;
    if (currentDocument.value?.id === id) {
      currentDocument.value.isFeatured = isFeatured;
    }
    
    return document;
  };

  const setRecommendedDocument = async (id: string, isRecommended: boolean): Promise<KnowledgeBaseDocument> => {
    const document = documents.value.find(doc => doc.id === id);
    if (!document) {
      throw new Error('文档不存在');
    }
    
    document.isRecommended = isRecommended;
    if (currentDocument.value?.id === id) {
      currentDocument.value.isRecommended = isRecommended;
    }
    
    return document;
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    documents.value = [];
    currentDocument.value = null;
    categories.value = [];
    currentCategory.value = null;
    searchParams.value = { page: 1, size: 10 };
    searchResult.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    documents,
    currentDocument,
    categories,
    currentCategory,
    searchParams,
    searchResult,
    loading,
    error,
    
    // Getters
    getDocuments,
    getCurrentDocument, 
    getCurrentCategory,
    getSearchParams,
    getSearchResult,
    isLoading,
    getError,
    
    // Actions
    searchDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    publishDocument,
    archiveDocument,
    getCategories: fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getDocumentsByCategory,
    incrementViewCount,
    likeDocument,
    unlikeDocument,
    collectDocument,
    uncollectDocument,
    setFeaturedDocument,
    setRecommendedDocument,
    clearError,
    reset
  };
});