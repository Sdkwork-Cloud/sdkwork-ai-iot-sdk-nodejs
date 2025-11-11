<template> 
    <sdkwork-page-container
    safe-area
    
    theme-mode="auto" 
  >
      <sdkwork-group-list
        :api="fetchGroups"
        :params="params"
        :page-size="20"
        :searchable="true"
        :show-filter="true"
        :show-sort="true"
        :show-join-button="true"
        @group-click="handleGroupClick"
        @join="handleJoinGroup"
        @search="handleSearch"
        @filter="handleFilter"
        @sort="handleSort"
        @load="handleLoad"
      />
    </sdkwork-page-container> 
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkGroupList from '@/components/sdkwork-group-list/sdkwork-group-list.vue'
import type { Group } from '@/components/sdkwork-group-item/types'
definePage({
    meta: {
        title: '群列表'
    }
})
// 路由
const router = useRouter()

// 响应式数据

// API 参数
const params = reactive({
  keyword: '',
  filter: 'all',
  sort: 'hot'
})

// 模拟API请求
const fetchGroups = async (params: any, pageableParams?: any) => {
  console.log('请求参数:', params, pageableParams)
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 模拟群组数据
  const mockGroups: Group[] = [
    {
      id: '1',
      name: '前端技术交流群',
      description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。欢迎各位前端爱好者加入！',
      avatar: 'https://picsum.photos/seed/frontend/200/200.jpg',
      tags: ['前端', '技术', '交流', 'React', 'Vue'],
      memberCount: 3586,
      maxMembers: 5000,
      messageCount: 128560,
      price: 0,
      isOfficial: true,
      isVerified: true,
      isHot: true,
      type: 'official',
      createdAt: '2022-01-15',
    },
    {
      id: '2',
      name: '设计师创意工坊',
      description: 'UI/UX设计师聚集地，分享设计经验、展示作品、获取反馈、寻找灵感。',
      avatar: 'https://picsum.photos/seed/design/200/200.jpg',
      tags: ['设计', 'UI/UX', '创意'],
      memberCount: 1923,
      messageCount: 64230,
      price: 19.9,
      originalPrice: 39.9,
      isVerified: true,
      isHot: true,
      type: 'public',
      createdAt: '2022-03-20',
    },
    {
      id: '3',
      name: '产品经理交流圈',
      description: '产品思维碰撞、需求分析、用户研究、产品规划讨论，助力产品能力提升。',
      avatar: 'https://picsum.photos/seed/pm/200/200.jpg',
      tags: ['产品', '需求', '规划'],
      memberCount: 1245,
      messageCount: 38920,
      price: 0,
      isVerified: true,
      type: 'public',
      createdAt: '2022-05-10',
    },
    {
      id: '4',
      name: 'Java开发精英群',
      description: 'Java技术分享、架构设计、性能优化、面试经验交流，打造高质量Java开发者社区。',
      avatar: 'https://picsum.photos/seed/java/200/200.jpg',
      tags: ['Java', '后端', '架构'],
      memberCount: 2890,
      maxMembers: 3000,
      messageCount: 98760,
      price: 29.9,
      isVerified: true,
      isHot: true,
      type: 'public',
      createdAt: '2022-02-28',
    },
    {
      id: '5',
      name: '投资理财交流群',
      description: '投资理念分享、市场分析、风险控制、财富管理，共同探索财富增长之路。',
      avatar: 'https://picsum.photos/seed/invest/200/200.jpg',
      tags: ['投资', '理财', '股票', '基金'],
      memberCount: 5678,
      messageCount: 185430,
      price: 0,
      isVerified: true,
      isHot: true,
      isJoined: true,
      type: 'public',
      createdAt: '2021-12-05',
    },
    {
      id: '6',
      name: '摄影爱好者社群',
      description: '摄影技巧分享、作品点评、器材讨论、后期处理交流，记录美好瞬间。',
      avatar: 'https://picsum.photos/seed/photo/200/200.jpg',
      tags: ['摄影', '后期', '器材'],
      memberCount: 876,
      messageCount: 21560,
      price: 9.9,
      type: 'public',
      createdAt: '2022-04-15',
    },
    {
      id: '7',
      name: 'AI人工智能探讨',
      description: '人工智能技术前沿、机器学习、深度学习、大模型应用讨论，探索AI未来。',
      avatar: 'https://picsum.photos/seed/ai/200/200.jpg',
      tags: ['AI', '机器学习', '深度学习'],
      memberCount: 2345,
      messageCount: 78920,
      price: 39.9,
      isOfficial: true,
      isVerified: true,
      isHot: true,
      type: 'official',
      createdAt: '2022-06-01',
    },
    {
      id: '8',
      name: '创业交流圈',
      description: '创业经验分享、资源对接、投资人交流、商业模式探讨，助力创业者成长。',
      avatar: 'https://picsum.photos/seed/startup/200/200.jpg',
      tags: ['创业', '资源', '投资'],
      memberCount: 1567,
      messageCount: 45320,
      price: 0,
      isVerified: true,
      type: 'public',
      createdAt: '2022-03-08',
    },
  ]
  
  // 模拟筛选和搜索逻辑
  let filteredGroups = [...mockGroups]
  
  // 关键词搜索
  if (params.keyword) {
    filteredGroups = filteredGroups.filter(group =>
      group.name.includes(params.keyword) ||
      group.description.includes(params.keyword) ||
      (group.tags && group.tags.some(tag => tag.includes(params.keyword)))
    )
  }
  
  // 筛选类型
  if (params.filter && params.filter !== 'all') {
    if (params.filter === 'free') {
      filteredGroups = filteredGroups.filter(group => group.price === 0)
    } else if (params.filter === 'paid') {
      filteredGroups = filteredGroups.filter(group => group.price > 0)
    } else if (params.filter === 'official') {
      filteredGroups = filteredGroups.filter(group => group.type === 'official')
    } else if (params.filter === 'joined') {
      filteredGroups = filteredGroups.filter(group => group.isJoined)
    }
  }
  
  // 排序
  if (params.sort) {
    if (params.sort === 'hot') {
      filteredGroups.sort((a, b) => b.memberCount - a.memberCount)
    } else if (params.sort === 'newest') {
      filteredGroups.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    } else if (params.sort === 'members') {
      filteredGroups.sort((a, b) => b.memberCount - a.memberCount)
    } else if (params.sort === 'priceLow') {
      filteredGroups.sort((a, b) => a.price - b.price)
    } else if (params.sort === 'priceHigh') {
      filteredGroups.sort((a, b) => b.price - a.price)
    }
  }
  
  // 模拟分页
  const pageSize = pageableParams?.pageSize || 20
  const pageNumber = pageableParams?.pageNumber || 1
  
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex)
  
  return {
    content: paginatedGroups,
    totalElements: filteredGroups.length,
    totalPages: Math.ceil(filteredGroups.length / pageSize),
    pageNumber: pageNumber,
    pageSize: pageSize,
    first: pageNumber === 1,
    last: endIndex >= filteredGroups.length,
    numberOfElements: paginatedGroups.length,
    empty: paginatedGroups.length === 0
  }
}

// 处理返回按钮点击
const onClickLeft = () => {
  router.back()
}
 

// 处理群组点击
const handleGroupClick = (group: Group) => {
  router.push(`/group/detail/${group.id}`)
}

// 处理加入群组
const handleJoinGroup = (group: Group) => {
  if (group.isJoined) {
    showToast('您已加入该群组')
    return
  }

  if (group.price > 0) {
    showConfirmDialog({
      title: '付费入群',
      message: `加入"${group.name}"需要支付 ¥${group.price}，是否确认？`,
    })
      .then(() => {
        // 模拟支付
        showToast('模拟支付成功，已加入群组')
      })
      .catch(() => {
        // 取消支付
      })
  } else {
    // 免费加入
    showToast('已加入群组')
  }
}

// 处理搜索
const handleSearch = (keyword: string) => {
  params.keyword = keyword
  console.log('搜索关键词:', keyword)
}

// 处理筛选
const handleFilter = (value: string) => {
  params.filter = value
  console.log('筛选条件:', value)
}

// 处理排序
const handleSort = (value: string) => {
  params.sort = value
  console.log('排序条件:', value)
}

// 处理数据加载
const handleLoad = (data: any) => {
  console.log('数据加载完成:', data)
}



// 获取群组类型文本
const getGroupTypeText = (type?: string) => {
  const typeMap: Record<string, string> = {
    public: '公开群',
    private: '私密群',
    official: '官方群',
  }
  return typeMap[type || 'public'] || '公开群'
}
</script>

<style scoped>
.group-list-page {
  background: var(--bg-page, #f7f8fa);
  min-height: 100vh;
  padding-top: 46px; /* 导航栏高度 */
}

.content {
  padding: 0;
}


</style>