(function() {
    'use strict';
    
    // 使用全局Vue对象
    const { defineComponent, ref, computed, onMounted } = Vue;
    
    // 应用头部组件
    const AppHeader = defineComponent({
        name: 'AppHeader',
        
        template: `
            <van-nav-bar
                :title="title"
                :left-text="leftText"
                :left-arrow="showLeftArrow"
                @click-left="handleLeftClick"
                @click-right="handleRightClick"
            >
                <template #right>
                    <van-icon v-if="showSearch" name="search" size="18" @click="handleSearchClick" />
                    <van-icon v-if="showMenu" name="ellipsis" size="18" @click="handleMenuClick" />
                    <van-badge v-if="unreadCount > 0" :content="unreadCount" max="99">
                        <van-icon name="chat-o" size="18" @click="handleChatClick" />
                    </van-badge>
                </template>
            </van-nav-bar>
        `,
        
        props: {
            title: {
                type: String,
                default: 'SDKWork AIoT'
            },
            leftText: {
                type: String,
                default: '返回'
            },
            showLeftArrow: {
                type: Boolean,
                default: true
            },
            showSearch: {
                type: Boolean,
                default: false
            },
            showMenu: {
                type: Boolean,
                default: false
            },
            unreadCount: {
                type: Number,
                default: 0
            }
        },
        
        emits: ['left-click', 'right-click', 'search-click', 'menu-click', 'chat-click'],
        
        setup(props, { emit }) {
            // 方法
            const handleLeftClick = () => {
                emit('left-click');
            };
            
            const handleRightClick = () => {
                emit('right-click');
            };
            
            const handleSearchClick = () => {
                emit('search-click');
            };
            
            const handleMenuClick = () => {
                emit('menu-click');
            };
            
            const handleChatClick = () => {
                emit('chat-click');
            };
            
            return {
                handleLeftClick,
                handleRightClick,
                handleSearchClick,
                handleMenuClick,
                handleChatClick
            };
        }
    });
    
    // 全局注册组件
    window.AppHeader = AppHeader;
    
})();