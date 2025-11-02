<template>
  <sdkwork-page-container safe-area scrollable theme-mode="auto">
    <sdkwork-appointment-list ref="appointmentListRef" :api="appointmentApi" :searchable="true" :selectable="false"
      :deletable="false" :show-actions="true" @select="handleSelect" @delete="handleDelete" @search="handleSearch"
      @load="handleLoad" @tab-change="handleTabChange" @action="handleAction" @click="handleClick">
      <!-- 自定义空状态 -->
      <template #empty>
        <van-empty image="calendar-o" :description="emptyText">
          <van-button round type="primary" @click="handleNewAppointment">
            立即预约
          </van-button>
        </van-empty>
      </template>

      <!-- 自定义头部 -->
      <template #header>
        <div class="appointment-header">
          <h2 class="header-title">我的预约</h2>
          <p class="header-subtitle">管理您的服务预约和医疗就诊安排</p>
        </div>
      </template>
    </sdkwork-appointment-list>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import { AppointmentStatus, AppointmentType } from '@/components/sdkwork-appointment-list'
import type { Appointment } from '@/components/sdkwork-appointment-list'
definePage({
    meta: {
        title: '预约管理',
        hideBackButton: true
    }
})
const router = useRouter()

// 预约列表组件引用
const appointmentListRef = ref()

// 当前激活的Tab
const activeTab = ref('all')

// 空状态文本
const emptyText = computed(() => {
  const textMap: Record<string, string> = {
    all: '暂无预约记录',
    [AppointmentStatus.PENDING]: '暂无待确认预约',
    [AppointmentStatus.CONFIRMED]: '暂无已确认预约',
    [AppointmentStatus.IN_PROGRESS]: '暂无进行中预约',
    [AppointmentStatus.COMPLETED]: '暂无已完成预约',
    [AppointmentStatus.CANCELLED]: '暂无已取消预约'
  }
  return textMap[activeTab.value] || '暂无预约记录'
})

// 模拟预约数据
const mockAppointments: Appointment[] = [
  {
    id: 1,
    appointmentNo: 'AP20240001',
    title: 'AI技术咨询服务',
    type: AppointmentType.SERVICE,
    status: AppointmentStatus.PENDING,
    statusText: '待确认',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天后
    location: '线上会议',
    staffName: '张技术顾问',
    customerName: '李客户',
    customerPhone: '138****1234',
    notes: '关于AI绘画技术的深度咨询',
    fee: 299,
    currency: '¥',
    serviceItems: [
      { id: 1, serviceName: 'AI技术咨询', duration: 60, fee: 299 }
    ]
  },
  {
    id: 2,
    appointmentNo: 'AP20240002',
    title: '产品演示会议',
    type: AppointmentType.BUSINESS,
    status: AppointmentStatus.CONFIRMED,
    statusText: '已确认',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天后
    location: '公司会议室',
    staffName: '李销售经理',
    customerName: '王客户',
    customerPhone: '139****5678',
    notes: '新产品功能演示和商务洽谈',
    fee: 0,
    serviceItems: [
      { id: 1, serviceName: '产品演示', duration: 90 }
    ]
  },
  {
    id: 3,
    appointmentNo: 'AP20240003',
    title: '技术培训课程',
    type: AppointmentType.EDUCATION,
    status: AppointmentStatus.COMPLETED,
    statusText: '已完成',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    location: '培训中心',
    staffName: '王培训师',
    customerName: '赵学员',
    customerPhone: '136****9012',
    notes: 'AI应用开发实战培训',
    fee: 899,
    currency: '¥',
    serviceItems: [
      { id: 1, serviceName: 'AI开发基础', duration: 120, fee: 299 },
      { id: 2, serviceName: '实战项目指导', duration: 180, fee: 600 }
    ]
  },
  {
    id: 4,
    appointmentNo: 'AP20240004',
    title: '医疗健康检查',
    type: AppointmentType.MEDICAL,
    status: AppointmentStatus.IN_PROGRESS,
    statusText: '进行中',
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 明天
    location: '健康体检中心',
    staffName: '刘医生',
    customerName: '钱先生',
    customerPhone: '137****3456',
    notes: '年度健康体检和咨询',
    fee: 580,
    currency: '¥',
    serviceItems: [
      { id: 1, serviceName: '基础体检', duration: 60, fee: 200 },
      { id: 2, serviceName: '专项检查', duration: 90, fee: 380 }
    ]
  }
]

// 预约API方法
const appointmentApi = async (params: Pageable | any): Promise<Page<Appointment>|any> => {
  const { page = 1, size = 10, status } = params

  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 过滤数据
  let filteredData = mockAppointments
  if (status && status !== 'all') {
    filteredData = mockAppointments.filter(item => item.status === status)
  }

  // 分页处理
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const pageData = filteredData.slice(startIndex, endIndex)

  return {
    content: pageData, 
    size: size,
    totalElements: filteredData.length,
    totalPages: Math.ceil(filteredData.length / size)
  }
}

// 事件处理函数
const handleSelect = (appointment: Appointment) => {
  console.log('选择预约:', appointment)
}

const handleDelete = async (appointment: Appointment) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除"${appointment.title}"的预约记录吗？`
    })
    showToast('预约记录已删除')
  } catch {
    // 用户取消操作
  }
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<Appointment>) => {
  console.log('数据加载完成:', pageData)
}

const handleTabChange = (tab: any, params: Record<string, any>) => {
  activeTab.value = tab.value
  console.log('Tab切换:', tab, params)
}

const handleAction = (appointment: Appointment, action: string) => {
  console.log('操作按钮点击:', action, appointment)

  switch (action) {
    case 'view':
      handleView(appointment)
      break
    case 'edit':
      handleModify(appointment)
      break
    case 'confirm':
      handleConfirm(appointment)
      break
    case 'cancel':
      handleCancel(appointment)
      break
    case 'start':
      handleStart(appointment)
      break
    case 'complete':
      handleComplete(appointment)
      break
    case 'reschedule':
      handleReschedule(appointment)
      break
  }
}

const handleClick = (appointment: Appointment) => {
  handleView(appointment)
}

// 新建预约
const handleNewAppointment = () => {
  router.push('/appointment/create')
}

// 查看预约详情
const handleView = (appointment: Appointment) => {
  router.push(`/appointment/detail/${appointment.id}`)
}

// 修改预约
const handleModify = (appointment: Appointment) => {
  showToast(`修改预约：${appointment.title}`)
  // 这里可以跳转到修改页面
}

// 确认预约
const handleConfirm = (appointment: Appointment) => {
  showToast(`已确认预约：${appointment.title}`)
}

// 取消预约
const handleCancel = async (appointment: Appointment) => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: `确定要取消"${appointment.title}"的预约吗？`
    })
    showToast('预约已取消')
  } catch {
    // 用户取消操作
  }
}

// 开始服务
const handleStart = (appointment: Appointment) => {
  showToast(`开始服务：${appointment.title}`)
}

// 完成服务
const handleComplete = (appointment: Appointment) => {
  showToast(`完成服务：${appointment.title}`)
}

// 重新预约
const handleReschedule = (appointment: Appointment) => {
  showToast(`重新预约：${appointment.title}`)
}

// 页面加载时刷新数据
onMounted(() => {
  appointmentListRef.value?.refresh()
})
</script>

<style scoped lang="scss">
.appointment-header {
  padding: 16px;
  text-align: center;

  .header-title {
    font-size: 20px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 8px;
  }

  .header-subtitle {
    font-size: 14px;
    color: #646566;
    margin: 0;
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .appointment-header {
    .header-title {
      color: #e2e8f0;
    }

    .header-subtitle {
      color: #a0aec0;
    }
  }
}
</style>