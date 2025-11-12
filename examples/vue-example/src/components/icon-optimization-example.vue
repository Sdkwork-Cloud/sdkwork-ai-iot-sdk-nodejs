<template>
  <div class="icon-optimization-example">
    <h2>图标优化示例：使用 Remix Icon (ri)</h2>
    
    <div class="comparison-section">
      <h3>原 van-icon 与 Iconify ri 图标对比</h3>
      
      <div class="icon-group">
        <h4>基础操作图标</h4>
        <div class="icon-row">
          <div class="icon-item">
            <p>原 van-icon</p>
            <van-icon name="plus" />
            <span>添加</span>
          </div>
          <div class="icon-item">
            <p>优化后 ri</p>
            <sdkwork-icon icon="ri:add-line" />
            <span>添加</span>
          </div>
        </div>
        
        <div class="icon-row">
          <div class="icon-item">
            <p>原 van-icon</p>
            <van-icon name="cross" />
            <span>关闭</span>
          </div>
          <div class="icon-item">
            <p>优化后 ri</p>
            <sdkwork-icon icon="ri:close-line" />
            <span>关闭</span>
          </div>
        </div>
      </div>
      
      <div class="icon-group">
        <h4>媒体操作图标</h4>
        <div class="icon-row">
          <div class="icon-item">
            <p>原 van-icon</p>
            <van-icon name="play-circle-o" />
            <span>播放</span>
          </div>
          <div class="icon-item">
            <p>优化后 ri</p>
            <sdkwork-icon icon="ri:play-circle-line" />
            <span>播放</span>
          </div>
        </div>
        
        <div class="icon-row">
          <div class="icon-item">
            <p>原 van-icon</p>
            <van-icon name="replay" />
            <span>重新生成</span>
          </div>
          <div class="icon-item">
            <p>优化后 ri</p>
            <sdkwork-icon icon="ri:refresh-line" />
            <span>重新生成</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="button-examples">
      <h3>按钮中使用图标的正确方式</h3>
      
      <div class="button-group">
        <h4>方法1：直接在按钮内容中包含图标</h4>
        <van-button size="small" round>
          <sdkwork-icon icon="ri:search-line" />
          搜索
        </van-button>
        
        <van-button size="small" round type="primary">
          <sdkwork-icon icon="ri:download-2-line" />
          下载
        </van-button>
      </div>
      
      <div class="button-group">
        <h4>方法2：使用插槽（推荐）</h4>
        <van-button size="small" round>
          <template #icon>
            <sdkwork-icon icon="ri:share-line" />
          </template>
          分享
        </van-button>
        
        <van-button size="small" round type="primary">
          <template #icon>
            <sdkwork-icon icon="ri:save-line" />
          </template>
          保存
        </van-button>
      </div>
      
      <div class="button-group">
        <h4>方法3：只有图标按钮</h4>
        <van-button size="small" round>
          <sdkwork-icon icon="ri:edit-line" />
        </van-button>
        
        <van-button size="small" round type="danger">
          <sdkwork-icon icon="ri:delete-bin-line" />
        </van-button>
      </div>
    </div>
    
    <div class="icon-props">
      <h3>图标组件属性</h3>
      <div class="props-grid">
        <div class="prop-item">
          <h4>基础用法</h4>
          <sdkwork-icon icon="ri:heart-line" />
          <pre><code>&lt;sdkwork-icon icon="ri:heart-line" /&gt;</code></pre>
        </div>
        
        <div class="prop-item">
          <h4>设置大小</h4>
          <sdkwork-icon icon="ri:star-line" width="24" height="24" />
          <pre><code>&lt;sdkwork-icon icon="ri:star-line" width="24" height="24" /&gt;</code></pre>
        </div>
        
        <div class="prop-item">
          <h4>设置颜色</h4>
          <sdkwork-icon icon="ri:home-heart-line" color="#ff4d4f" />
          <pre><code>&lt;sdkwork-icon icon="ri:home-heart-line" color="#ff4d4f" /&gt;</code></pre>
        </div>
        
        <div class="prop-item">
          <h4>填充风格</h4>
          <sdkwork-icon icon="ri:notification-fill" />
          <pre><code>&lt;sdkwork-icon icon="ri:notification-fill" /&gt;</code></pre>
        </div>
      </div>
    </div>
    
    <div class="icon-search">
      <h3>图标查找</h3>
      <p>Remix Icon 官网：<a href="https://remixicon.com/" target="_blank">https://remixicon.com/</a></p>
      <p>使用格式：ri:图标名，例如：</p>
      <ul>
        <li>线条风格：ri:home-line</li>
        <li>填充风格：ri:home-fill</li>
        <li>自定义大小：width="20" height="20"</li>
        <li>自定义颜色：color="#1976d2"</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped lang="scss">
.icon-optimization-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h2, h3, h4 {
    margin-bottom: 16px;
  }
  
  .comparison-section {
    margin-bottom: 40px;
  }
  
  .icon-group {
    margin-bottom: 24px;
    
    .icon-row {
      display: flex;
      margin-bottom: 12px;
      gap: 24px;
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 4px;
        min-width: 120px;
        
        p {
          margin: 0 0 8px;
          font-size: 14px;
          color: #666;
        }
        
        span {
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
  
  .button-examples {
    margin-bottom: 40px;
    
    .button-group {
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      
      h4 {
        min-width: 200px;
        margin: 0;
        font-size: 16px;
      }
    }
  }
  
  .icon-props {
    margin-bottom: 40px;
    
    .props-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      
      .prop-item {
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 4px;
        
        h4 {
          margin: 0 0 12px;
          font-size: 16px;
        }
        
        pre {
          margin: 8px 0 0;
          padding: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          overflow-x: auto;
          
          code {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .icon-search {
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 4px;
    
    ul {
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
      }
    }
  }
}
</style>