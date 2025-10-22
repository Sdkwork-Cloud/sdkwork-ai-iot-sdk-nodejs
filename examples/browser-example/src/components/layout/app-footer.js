(function() {
    'use strict';
    
    // 使用全局Vue对象
    const { defineComponent, ref, computed, onMounted } = Vue;
    
    // 应用底部导航组件
    const AppFooter = defineComponent({
        name: 'AppFooter',
        
        template: `
            <van-tabbar v-model="activeTab" @change="handleTabChange">
                <van-tabbar-item 
                    name="home" 
                    icon="home-o"
                    :badge="homeBadge"
                >
                    首页
                </van-tabbar-item>
                <van-tabbar-item 
                    name="device" 
                    icon="friends-o"
                    :badge="deviceBadge"
                >
                    设备
                </van-tabbar-item>
                <van-tabbar-item 
                    name="chat" 
                    icon="chat-o"
                    :badge="chatBadge"
                >
                    聊天
                </van-tabbar-item>
                <van-tabbar-item 
                    name="user" 
                    icon="user-o"
                >
                    我的
                </van-tabbar-item>
            </van-tabbar>
        `,
        
        props: {
            activeTab: {
                type: String,
                default: 'home'
            },
            homeBadge: {
                type: [String, Number],
                default: null
            },
            deviceBadge: {
                type: [String, Number],
                default: null
            },
            chatBadge: {
                type: [String, Number],
                default: null
            }
        },
        
        emits: ['tab-change'],
        
        setup(props, { emit }) {
            const activeTab = ref(props.activeTab);
            
            // 监听props变化
            watch(() => props.activeTab, (newVal) => {
                activeTab.value = newVal;
            });
            
            // 方法
            const handleTabChange = (tabName) => {
                activeTab.value = tabName;
                emit('tab-change', tabName);
                
                // 根据标签跳转到对应页面
                switch (tabName) {
                    case 'home':
                        window.location.href = '../../index.html';
                        break;
                    case 'device':
                        window.location.href = '../device/list.html';
                        break;
                    case 'chat':
                        window.location.href = '../chat/index.html';
                        break;
                    case 'user':
                        window.location.href = '../user/profile.html';
                        break;
                }
            };
            
            return {
                activeTab,
                handleTabChange
            };
        }
    });
    
    // 全局注册组件
    window.AppFooter = AppFooter;
    
})();