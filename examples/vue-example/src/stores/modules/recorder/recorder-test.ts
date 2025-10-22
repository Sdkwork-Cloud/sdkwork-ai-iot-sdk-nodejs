/**
 * 录制器 Store 功能测试
 * 
 * 用于验证 useRecorderStore 中录制功能的真实逻辑实现
 */

import { useRecorderStore } from './index'
import { AudioRecorder } from '../../../core/audio/recorder'

// 模拟测试函数
export async function testRecorderStore() {
  console.log('开始测试录制器 Store 功能...')
  
  const store = useRecorderStore()
  
  try {
    // 测试 1: 配置更新
    console.log('测试 1: 配置更新')
    store.updateConfig({
      sampleRate: 44100,
      format: 'mp3',
      enableWave: true
    })
    console.log('配置更新成功:', store.config)
    
    // 测试 2: 录制器初始化
    console.log('测试 2: 录制器初始化')
    await store.startRecording()
    console.log('录制器初始化成功，当前状态:', store.currentState)
    
    // 测试 3: 录制操作
    console.log('测试 3: 录制操作')
    if (store.isRecording) {
      console.log('录制中...')
      
      // 模拟录制一段时间
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 测试 4: 暂停录制
      console.log('测试 4: 暂停录制')
      store.pauseRecording()
      console.log('录制已暂停，当前状态:', store.currentState)
      
      // 测试 5: 恢复录制
      console.log('测试 5: 恢复录制')
      store.resumeRecording()
      console.log('录制已恢复，当前状态:', store.currentState)
      
      // 继续录制一段时间
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 测试 6: 停止录制
      console.log('测试 6: 停止录制')
      const record = await store.stopRecording()
      console.log('录制已停止，录制记录:', record)
      
      // 测试 7: 录制记录管理
      console.log('测试 7: 录制记录管理')
      console.log('录制记录数量:', store.recordCount)
      console.log('最新录制记录:', store.latestRecord)
      
      // 测试 8: 下载录制文件
      console.log('测试 8: 下载录制文件')
      if (record) {
        store.downloadRecord(record.id, 'test-recording.mp3')
        console.log('下载录制文件功能测试完成')
      }
      
      // 测试 9: 清理资源
      console.log('测试 9: 清理资源')
      store.cleanup()
      console.log('资源清理完成')
      
    } else {
      console.error('录制器未正确启动')
    }
    
  } catch (error) {
    console.error('录制器测试失败:', error)
  }
  
  console.log('录制器 Store 功能测试完成')
}

// 测试录制器核心功能
export async function testAudioRecorder() {
  console.log('开始测试 AudioRecorder 核心功能...')
  
  try {
    // 创建录制器实例
    const recorder = new AudioRecorder({
      sampleRate: 16000,
      format: 'pcm',
      waveView: {
        enable: false
      }
    })
    
    // 测试初始化
    await recorder.initialize()
    console.log('AudioRecorder 初始化成功')
    
    // 测试录制
    await recorder.startRecordToFile()
    console.log('AudioRecorder 开始录制成功')
    
    // 模拟录制一段时间
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 测试停止录制
    const result = await recorder.stopRecord()
    console.log('AudioRecorder 停止录制成功，录制时长:', result.duration)
    
    // 测试销毁
    recorder.destroy()
    console.log('AudioRecorder 销毁成功')
    
  } catch (error) {
    console.error('AudioRecorder 测试失败:', error)
  }
  
  console.log('AudioRecorder 核心功能测试完成')
}

// 导出测试函数
export default {
  testRecorderStore,
  testAudioRecorder
}