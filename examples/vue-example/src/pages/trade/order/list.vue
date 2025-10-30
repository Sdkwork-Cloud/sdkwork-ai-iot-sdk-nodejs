<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
     

    <!-- 批量操作工具栏 -->
    <div v-if="selectedOrders.length > 0" class="batch-toolbar">
      <div class="batch-info">
        <van-checkbox v-model="allSelected" @change="handleSelectAll">
          已选中 {{ selectedOrders.length }} 个订单
        </van-checkbox>
      </div>
      <div class="batch-actions">
        <van-button
          type="primary"
          size="small"
          @click="handleBatchConfirm"
          :disabled="!canBatchConfirm"
        >
          批量确认
        </van-button>
        <van-button
          type="warning"
          size="small"
          @click="handleBatchCancel"
          :disabled="!canBatchCancel"
        >
          批量取消
        </van-button>
        <van-button
          type="danger"
          size="small"
          @click="handleBatchDelete"
        >
          批量删除
        </van-button>
      </div>
    </div>

    <!-- 订单列表 -->
    <sdkwork-order-list
      ref="orderListRef"
      :api="getOrderList"
      :params="mergedFilterParams"
      searchable
      selectable
      deletable
      :show-actions="true"
      :action-buttons="actionButtons"
      @select="handleOrderSelect"
      @delete="handleOrderDelete"
      @action="handleOrderAction"
      @search="handleSearch"
      @tab-change="handleTabChange"
      @load="handleDataLoad"
    >
      <!-- 自定义订单项头部 -->
      <template #order-header="{ order, index }">
        <div class="order-header-custom">
          <van-tag
            :type="getStatusTagType(order.status)"
            size="medium"
          >
            {{ order.statusText }}
          </van-tag>
          <span class="order-priority" v-if="order.priority === 'high'">
            <van-icon name="fire-o" color="#ff4d4f" />
            加急
          </span>
          <span class="order-source" v-if="order.source">
            {{ order.source }}
          </span>
        </div>
      </template>

      <!-- 自定义订单项内容 -->
      <template #order-content="{ order }">
        <div class="order-content-custom">
          <!-- 客户信息 -->
          <div class="customer-info">
            <van-icon name="user-o" />
            <span class="customer-name">{{ order.customerName }}</span>
            <span v-if="order.customerPhone" class="customer-phone">
              {{ order.customerPhone }}
            </span>
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <div class="product-images">
              <sdkwork-image
                v-for="item in order.items?.slice(0, 3)"
                :key="item.id"
                :src="item.productImage"
                width="40"
                height="40"
                fit="cover"
                radius="4"
              />
              <div v-if="(order.items?.length || 0) > 3" class="more-products">
                +{{ (order.items?.length || 0) - 3 }}
              </div>
            </div>
            <div class="product-summary">
              <div class="product-names">
                {{ getProductNames(order.items) }}
              </div>
              <div class="product-count">
                共 {{ order.items?.length || 0 }} 件商品
              </div>
            </div>
          </div>

          <!-- 金额信息 -->
          <div class="amount-info">
            <span class="amount-label">订单金额:</span>
            <span class="amount-value">¥{{ formatAmount(order.totalAmount) }}</span>
          </div>

          <!-- 时间信息 -->
          <div class="time-info">
            <van-icon name="clock-o" />
            <span class="create-time">{{ formatTime(order.createTime) }}</span>
          </div>
        </div>
      </template>

      <!-- 自定义空状态 -->
      <template #empty>
        <div class="custom-empty-state">
          <van-icon name="orders-o" size="64" color="#dcdee0" />
          <p class="empty-text">暂无订单数据</p>
          <p class="empty-desc">您可以尝试调整筛选条件或创建新订单</p>
          <van-button type="primary" @click="handleCreateOrder">
            创建新订单
          </van-button>
        </div>
      </template>
    </sdkwork-order-list>

    <!-- 时间选择器 -->
    <sdkwork-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDateRange"
        type="daterange"
        title="选择时间范围"
        @confirm="handleDateConfirm"
        @cancel="showDatePicker = false"
      />
    </sdkwork-popup>

    <!-- 状态选择器 -->
    <sdkwork-popup v-model:show="showStatusPicker" position="bottom">
      <van-picker
        :columns="statusOptions"
        title="选择订单状态"
        @confirm="handleStatusConfirm"
        @cancel="showStatusPicker = false"
      />
    </sdkwork-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showNotify } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { Order, OrderActionButton, SdkworkOrderListInstance } from '../../../components/sdkwork-order-list'

const router = useRouter()

// 组件引用
const orderListRef = ref<SdkworkOrderListInstance>()

// 响应式数据
const showDatePicker = ref(false)
const showStatusPicker = ref(false)
const showAdvancedFilter = ref(false)
const activeCollapse = ref<string[]>([])
const allSelected = ref(false)

// 筛选参数
const filterParams = ref({
  dateRange: '',
  status: '',
  orderNo: '',
  customerName: '',
  minAmount: '',
  maxAmount: ''
})

const currentDateRange = ref(['', ''])

// 状态选项
const statusOptions = [
  { text: '全部状态', value: '' },
  { text: '待处理', value: 'pending' },
  { text: '已确认', value: 'confirmed' },
  { text: '处理中', value: 'processing' },
  { text: '已发货', value: 'shipped' },
  { text: '已完成', value: 'delivered' },
  { text: '已取消', value: 'cancelled' }
]

// 选中的订单
const selectedOrders = ref<Order[]>([])

// 操作按钮配置
const actionButtons = ref<OrderActionButton[]>([
  { key: 'view', text: '查看详情', type: 'primary', icon: 'eye-o' },
  { key: 'edit', text: '编辑', type: 'default', icon: 'edit' },
  { 
    key: 'confirm', 
    text: '确认订单', 
    type: 'success', 
    icon: 'checked',
    showCondition: (order) => order.status === 'pending'
  },
  { 
    key: 'cancel', 
    text: '取消订单', 
    type: 'warning', 
    icon: 'close',
    showCondition: (order) => order.status === 'pending' || order.status === 'confirmed'
  },
  { 
    key: 'ship', 
    text: '发货', 
    type: 'primary', 
    icon: 'logistics',
    showCondition: (order) => order.status === 'confirmed'
  },
  { 
    key: 'complete', 
    text: '完成订单', 
    type: 'success', 
    icon: 'completed',
    showCondition: (order) => order.status === 'shipped'
  },
  { 
    key: 'export', 
    text: '导出订单', 
    type: 'default', 
    icon: 'down' 
  },
  { 
    key: 'print', 
    text: '打印订单', 
    type: 'default', 
    icon: 'printer' 
  }
])

// 计算属性
const mergedFilterParams = computed(() => {
  const params: Record<string, any> = {}
  
  if (filterParams.value.dateRange) {
    const [startDate, endDate] = filterParams.value.dateRange.split(',')
    params.startDate = startDate
    params.endDate = endDate
  }
  
  if (filterParams.value.status) {
    params.status = filterParams.value.status
  }
  
  if (filterParams.value.orderNo) {
    params.orderNo = filterParams.value.orderNo
  }
  
  if (filterParams.value.customerName) {
    params.customerName = filterParams.value.customerName
  }
  
  if (filterParams.value.minAmount) {
    params.minAmount = parseFloat(filterParams.value.minAmount)
  }
  
  if (filterParams.value.maxAmount) {
    params.maxAmount = parseFloat(filterParams.value.maxAmount)
  }
  
  return params
})

const canBatchConfirm = computed(() => {
  return selectedOrders.value.some(order => order.status === 'pending')
})

const canBatchCancel = computed(() => {
  return selectedOrders.value.some(order => 
    order.status === 'pending' || order.status === 'confirmed'
  )
})

// 模拟订单数据
const mockOrders = ref<any>([
  {
    id: '1',
    orderNo: 'ORD202410210001',
    status: 'pending',
    statusText: '待处理',
    customerName: '张三',
    customerPhone: '138****1234',
    totalAmount: 299.00,
    createTime: new Date('2024-10-21 10:30:00'),
    priority: 'normal',
    source: '小程序',
    items: [
      {
        id: '1',
        productName: 'AI绘画服务套餐',
        productImage: '/images/product1.jpg',
        quantity: 1,
        price: 299.00
      }
    ]
  },
  {
    id: '2',
    orderNo: 'ORD202410210002',
    status: 'confirmed',
    statusText: '已确认',
    customerName: '李四',
    customerPhone: '139****5678',
    totalAmount: 599.00,
    createTime: new Date('2024-10-20 15:20:00'),
    priority: 'high',
    source: '官网',
    items: [
      {
        id: '2',
        productName: '智能语音助手高级版',
        productImage: '/images/product2.jpg',
        quantity: 1,
        price: 599.00
      }
    ]
  },
  {
    id: '3',
    orderNo: 'ORD202410210003',
    status: 'processing',
    statusText: '处理中',
    customerName: '王五',
    customerPhone: '136****9012',
    totalAmount: 1299.00,
    createTime: new Date('2024-10-19 09:15:00'),
    priority: 'normal',
    source: 'APP',
    items: [
      {
        id: '3',
        productName: '企业级AI解决方案',
        productImage: '/images/product3.jpg',
        quantity: 1,
        price: 1299.00
      }
    ]
  },
  {
    id: '4',
    orderNo: 'ORD202410210004',
    status: 'shipped',
    statusText: '已发货',
    customerName: '赵六',
    customerPhone: '137****3456',
    totalAmount: 199.00,
    createTime: new Date('2024-10-18 14:45:00'),
    priority: 'normal',
    source: '小程序',
    items: [
      {
        id: '4',
        productName: '基础AI工具包',
        productImage: '/images/product4.jpg',
        quantity: 1,
        price: 199.00
      }
    ]
  },
  {
    id: '5',
    orderNo: 'ORD202410210005',
    status: 'delivered',
    statusText: '已完成',
    customerName: '钱七',
    customerPhone: '135****7890',
    totalAmount: 899.00,
    createTime: new Date('2024-10-17 11:20:00'),
    priority: 'normal',
    source: '官网',
    items: [
      {
        id: '5',
        productName: '专业AI创作工具',
        productImage: '/images/product5.jpg',
        quantity: 1,
        price: 899.00
      }
    ]
  }
])

// API方法
const getOrderList = async (params: Pageable): Promise<Page<Order>|any> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 实际项目中应该调用真实的API
    // const response = await orderApi.getOrderList(params)
    // return response.data
    
    // 模拟返回数据
    return {
      records: mockOrders.value,
      total: mockOrders.value.length,
      size: params.size || 10,
      current: params.page || 1,
      pages: Math.ceil(mockOrders.value.length / (params.size || 10))
    }
  } catch (error) {
    showNotify({ type: 'danger', message: '获取订单列表失败' })
    throw error
  }
}

// 事件处理函数
const handleOrderSelect = (order: Order) => {
  const index = selectedOrders.value.findIndex(item => item.id === order.id)
  if (index === -1) {
    selectedOrders.value.push(order)
  } else {
    selectedOrders.value.splice(index, 1)
  }
  allSelected.value = selectedOrders.value.length === (orderListRef.value?.getData()?.length || 0)
}

const handleOrderDelete = async (order: Order) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除订单 ${order.orderNo} 吗？此操作不可恢复。`
    })
    
    // 模拟删除操作
    const index = mockOrders.value.findIndex((item:any) => item.id === order.id)
    if (index !== -1) {
      mockOrders.value.splice(index, 1)
      showToast('删除成功')
      
      // 从选中列表中移除
      const selectedIndex = selectedOrders.value.findIndex(item => item.id === order.id)
      if (selectedIndex !== -1) {
        selectedOrders.value.splice(selectedIndex, 1)
      }
      
      // 刷新列表
      orderListRef.value?.refresh()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const handleOrderAction = (order: Order, action: string) => {
  console.log('订单操作:', action, order.orderNo)
  
  switch (action) {
    case 'view':
      router.push(`/trade/order/detail/${order.id}`)
      break
    case 'edit':
      router.push(`/trade/order/edit/${order.id}`)
      break
    case 'confirm':
      handleConfirmOrder(order)
      break
    case 'cancel':
      handleCancelOrder(order)
      break
    case 'ship':
      handleShipOrder(order)
      break
    case 'complete':
      handleCompleteOrder(order)
      break
    case 'export':
      handleExportOrder(order)
      break
    case 'print':
      handlePrintOrder(order)
      break
  }
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  // 实际项目中应该触发重新加载数据
  orderListRef.value?.refresh()
}

const handleTabChange = (tab: any, params: Record<string, any>) => {
  console.log('Tab切换:', tab.title, params)
  // 清空选中项
  selectedOrders.value = []
  allSelected.value = false
}

const handleDataLoad = (pageData: Page<Order>) => {
  console.log('数据加载完成:', pageData)
  // 清空选中项
  selectedOrders.value = []
  allSelected.value = false
}

const handleDateConfirm = (value: any) => {
  filterParams.value.dateRange = value.selectedValues.join(',')
  showDatePicker.value = false
  applyFilters()
}

const handleStatusConfirm = (value: any) => {
  filterParams.value.status = value.selectedValues[0]
  showStatusPicker.value = false
  applyFilters()
}

const handleFilter = () => {
  applyFilters()
}

const handleResetFilter = () => {
  filterParams.value = {
    dateRange: '',
    status: '',
    orderNo: '',
    customerName: '',
    minAmount: '',
    maxAmount: ''
  }
  applyFilters()
}

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedOrders.value = [...(orderListRef.value?.getData() || [])]
  } else {
    selectedOrders.value = []
  }
}

const handleBatchConfirm = async () => {
  try {
    await showConfirmDialog({
      title: '批量确认',
      message: `确定要确认选中的 ${selectedOrders.value.length} 个订单吗？`
    })
    
    // 模拟批量确认操作
    selectedOrders.value.forEach(order => {
      if (order.status === 'pending') { 
        order.statusText = '已确认'
      }
    })
    
    showToast('批量确认成功')
    orderListRef.value?.refresh()
    selectedOrders.value = []
    allSelected.value = false
  } catch (error) {
    // 用户取消操作
  }
}

const handleBatchCancel = async () => {
  try {
    await showConfirmDialog({
      title: '批量取消',
      message: `确定要取消选中的 ${selectedOrders.value.length} 个订单吗？`
    })
    
    // 模拟批量取消操作
    selectedOrders.value.forEach(order => {
      if (order.status === 'pending' || order.status === 'confirmed') { 
        order.statusText = '已取消'
      }
    })
    
    showToast('批量取消成功')
    orderListRef.value?.refresh()
    selectedOrders.value = []
    allSelected.value = false
  } catch (error) {
    // 用户取消操作
  }
}

const handleBatchDelete = async () => {
  try {
    await showConfirmDialog({
      title: '批量删除',
      message: `确定要删除选中的 ${selectedOrders.value.length} 个订单吗？此操作不可恢复。`
    })
    
    // 模拟批量删除操作
    selectedOrders.value.forEach(order => {
      const index = mockOrders.value.findIndex((item:any) => item.id === order.id)
      if (index !== -1) {
        mockOrders.value.splice(index, 1)
      }
    })
    
    showToast('批量删除成功')
    orderListRef.value?.refresh()
    selectedOrders.value = []
    allSelected.value = false
  } catch (error) {
    // 用户取消操作
  }
}

const handleCreateOrder = () => {
  router.push('/trade/order/create')
}

// 工具函数
const applyFilters = () => {
  orderListRef.value?.refresh()
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    confirmed: 'primary',
    processing: 'info',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'danger'
  }
  return typeMap[status] || 'default'
}

const getProductNames = (items?: any[]) => {
  if (!items || items.length === 0) return '暂无商品'
  return items.slice(0, 2).map(item => item.productName).join('，') + (items.length > 2 ? '...' : '')
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatTime = (time: string) => {
  try {
    const date = new Date(time)
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}

// 单个订单操作函数
const handleConfirmOrder = async (order: Order) => {
  // 确认订单逻辑
}

const handleCancelOrder = async (order: Order) => {
  // 取消订单逻辑
}

const handleShipOrder = async (order: Order) => {
  // 发货逻辑
}

const handleCompleteOrder = async (order: Order) => {
  // 完成订单逻辑
}

const handleExportOrder = (order: Order) => {
  // 导出订单逻辑
}

const handlePrintOrder = (order: Order) => {
  // 打印订单逻辑
}

// 监听筛选参数变化
watch(filterParams, () => {
  // 防抖处理，避免频繁刷新
}, { deep: true, immediate: true })
</script>

<style scoped lang="scss">
.order-management {
  height: 100dvh;
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .filter-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    
    .van-field {
      flex: 1;
      min-width: 0;
    }
  }
  
  .filter-title {
    font-weight: 500;
    color: #333;
  }
  
  .advanced-filters {
    padding: 12px 0;
    
    .amount-range {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .range-separator {
        color: #999;
        padding: 0 8px;
      }
    }
    
    .filter-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
  }
  
  .batch-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #e6f7ff;
    border-bottom: 1px solid #91d5ff;
    
    .batch-info {
      font-size: 14px;
      color: #1890ff;
    }
    
    .batch-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .order-header-custom {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .order-priority {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: #ff4d4f;
    }
    
    .order-source {
      font-size: 12px;
      color: #666;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
    }
  }
  
  .order-content-custom {
    .customer-info {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      font-size: 14px;
      
      .customer-name {
        font-weight: 500;
      }
      
      .customer-phone {
        color: #666;
        font-size: 12px;
      }
    }
    
    .product-info {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
      
      .product-images {
        display: flex;
        gap: 4px;
        
        .more-products {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          color: #999;
        }
      }
      
      .product-summary {
        flex: 1;
        
        .product-names {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        
        .product-count {
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .amount-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .amount-label {
        color: #666;
      }
      
      .amount-value {
        font-weight: bold;
        color: #ff6b6b;
        font-size: 16px;
      }
    }
    
    .time-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #999;
    }
  }
  
  .custom-empty-state {
    text-align: center;
    padding: 60px 20px;
    
    .empty-text {
      margin: 16px 0 8px;
      font-size: 16px;
      color: #999;
    }
    
    .empty-desc {
      margin: 0 0 24px;
      font-size: 14px;
      color: #ccc;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-management {
    .filter-toolbar {
      flex-direction: column;
      gap: 12px;
      
      .van-field {
        width: 100%;
      }
    }
    
    .batch-toolbar {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      
      .batch-actions {
        justify-content: space-between;
      }
    }
  }
}
</style>