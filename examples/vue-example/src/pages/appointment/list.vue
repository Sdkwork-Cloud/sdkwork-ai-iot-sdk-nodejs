<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto"
  >
    <template #header>
      <van-nav-bar
        title="我的预约"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      >
        <template #right>
          <van-button
            size="small"
            type="primary"
            @click="handleNewAppointment"
          >
            新建预约
          </van-button>
        </template>
      </van-nav-bar>
    </template>

    <div class="appointment-container">
      <!-- 状态筛选 -->
      <div class="status-filter">
        <van-tabs v-model="activeStatus" @change="handleStatusChange">
          <van-tab title="全部" name="all" />
          <van-tab title="待确认" name="pending" />
          <van-tab title="已确认" name="confirmed" />
          <van-tab title="已完成" name="completed" />
          <van-tab title="已取消" name="cancelled" />
        </van-tabs>
      </div>

      <van-empty
        image="calendar-o"
        :description="emptyText"
        v-if="filteredAppointments.length === 0"
      >
        <van-button
          round
          type="primary"
          @click="handleNewAppointment"
          v-if="activeStatus === 'all' || activeStatus === 'pending'"
        >
          立即预约
        </van-button>
      </van-empty>

      <div v-else class="appointment-list">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            class="appointment-item"
          >
            <div class="item-header">
              <div class="item-title">{{ appointment.title }}</div>
              <van-tag :type="getStatusType(appointment.status)">
                {{ getStatusText(appointment.status) }}
              </van-tag>
            </div>
            
            <div class="item-content">
              <div class="item-info">
                <div class="info-row">
                  <van-icon name="clock-o" />
                  <span>{{ formatDateTime(appointment.dateTime) }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="location-o" />
                  <span>{{ appointment.location || '线上会议' }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="user-o" />
                  <span>服务人员：{{ appointment.staffName }}</span>
                </div>
                <div class="info-row" v-if="appointment.notes">
                  <van-icon name="notes-o" />
                  <span class="notes">{{ appointment.notes }}</span>
                </div>
              </div>
            </div>
            
            <div class="item-actions" v-if="showActions(appointment.status)">
              <van-button
                size="small"
                type="primary"
                @click="handleView(appointment)"
              >
                查看详情
              </van-button>
              <van-button
                size="small"
                type="warning"
                @click="handleModify(appointment)"
                v-if="appointment.status === 'pending'"
              >
                修改
              </van-button>
              <van-button
                size="small"
                type="danger"
                @click="handleCancel(appointment)"
                v-if="appointment.status === 'pending' || appointment.status === 'confirmed'"
              >
                取消
              </van-button>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()

// 当前激活的状态筛选
const activeStatus = ref('all')

// 预约列表数据
const appointments = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)

// 模拟预约数据
const mockAppointments = [
  {
    id: 1,
    title: 'AI技术咨询',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2天后
    location: '线上会议',
    staffName: '张技术顾问',
    status: 'pending',
    notes: '关于AI绘画技术的咨询'
  },
  {
    id: 2,
    title: '产品演示',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5天后
    location: '公司会议室',
    staffName: '李销售经理',
    status: 'confirmed',
    notes: '新产品功能演示'
  },
  {
    id: 3,
    title: '技术培训',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    location: '培训中心',
    staffName: '王培训师',
    status: 'completed',
    notes: 'AI应用开发培训'
  }
]

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  if (activeStatus.value === 'all') {
    return appointments.value
  }
  return appointments.value.filter(item => item.status === activeStatus.value)
})

// 空状态文本
const emptyText = computed(() => {
  const textMap: Record<string, string> = {
    all: '暂无预约记录',
    pending: '暂无待确认预约',
    confirmed: '暂无已确认预约',
    completed: '暂无已完成预约',
    cancelled: '暂无已取消预约'
  }
  return textMap[activeStatus.value] || '暂无预约记录'
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || '未知'
}

// 格式化日期时间
const formatDateTime = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 是否显示操作按钮
const showActions = (status: string) => {
  return ['pending', 'confirmed'].includes(status)
}

// 状态筛选变化
const handleStatusChange = (name: string) => {
  activeStatus.value = name
  // 重新加载数据
  loadAppointments()
}

// 加载预约数据
const loadAppointments = () => {
  loading.value = true
  setTimeout(() => {
    appointments.value = [...mockAppointments]
    loading.value = false
    finished.value = true
  }, 500)
}

// 列表加载
const onLoad = () => {
  loadAppointments()
}

// 新建预约
const handleNewAppointment = () => {
  router.push('/appointment/create')
}

// 查看预约详情
const handleView = (appointment: any) => {
  router.push(`/appointment/detail/${appointment.id}`)
}

// 修改预约
const handleModify = (appointment: any) => {
  showToast(`修改预约：${appointment.title}`)
  // 这里可以跳转到修改页面
}

// 取消预约
const handleCancel = async (appointment: any) => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: `确定要取消"${appointment.title}"的预约吗？`
    })
    
    // 更新状态为已取消
    const index = appointments.value.findIndex(item => item.id === appointment.id)
    if (index !== -1) {
      appointments.value[index].status = 'cancelled'
    }
    
    showToast('预约已取消')
  } catch {
    // 用户取消操作
  }
}

// 页面加载时初始化数据
onMounted(() => {
  loadAppointments()
})
</script>

<style scoped lang="scss">
.appointment-container {
  padding: 16px;
  min-height: 400px;
}

.status-filter {
  margin-bottom: 16px;
}

.appointment-list {
  .appointment-item {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .item-title {
        font-size: 16px;
        font-weight: 500;
        color: #323233;
      }
    }
    
    .item-content {
      margin-bottom: 12px;
      
      .item-info {
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: #646566;
          
          .van-icon {
            margin-right: 8px;
            color: #969799;
          }
          
          .notes {
            color: #969799;
            font-style: italic;
          }
        }
      }
    }
    
    .item-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  }
}
</style>