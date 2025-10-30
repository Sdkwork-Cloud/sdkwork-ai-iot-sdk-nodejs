import Recorder from "recorder-core"

export class JsRecorderDataSender {
  private testSampleRate = 16000
  private testBitRate = 16
  private sendFrameSize = 1024
  
  private realTimeSendTryNumber = 0
  private transferUploadNumberMax = 0
  private realTimeSendTryChunk: any = null
  private realTimeSendTryChunks: any[] | null = null
  
  private rec: any = null
  private wave: any = null
  
  private callback: (blob: ArrayBuffer, encTime: number) => void

  constructor(callback: (blob: ArrayBuffer, encTime: number) => void) {
    this.callback = callback
    // 去掉console
    Recorder.CLog = () => {}
  }

  /**
   * 重置环境，每次开始录音时必须先调用此方法，清理环境
   */
  private realTimeSendTryReset(): void {
    this.realTimeSendTryChunks = null
  }

  /**
   * 实时处理核心函数
   */
  private realTimeSendTry(buffers: any[], bufferSampleRate: number, isClose: boolean): void {
    if (this.realTimeSendTryChunks == null) {
      this.realTimeSendTryNumber = 0
      this.transferUploadNumberMax = 0
      this.realTimeSendTryChunk = null
      this.realTimeSendTryChunks = []
    }
    
    // 配置有效性检查
    if (this.testBitRate == 16 && this.sendFrameSize % 2 == 1) {
      return
    }
 
    let pcm: number[] = []
    let pcmSampleRate = 0
    
    if (buffers.length > 0) {
      // 借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
      const chunk = Recorder.SampleData(
        buffers,
        bufferSampleRate,
        this.testSampleRate,
        this.realTimeSendTryChunk
      )

      // 清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
      for (
        let i = this.realTimeSendTryChunk ? this.realTimeSendTryChunk.index : 0;
        i < chunk.index - 3;
        i++
      ) {
        buffers[i] = null
      }
      
      this.realTimeSendTryChunk = chunk // 此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件

      pcm = chunk.data
      pcmSampleRate = chunk.sampleRate
      
      if (pcmSampleRate != this.testSampleRate) {
        // 除非是onProcess给的bufferSampleRate低于testSampleRate
        throw new Error(
          `不应该出现pcm采样率${pcmSampleRate}和需要的采样率${this.testSampleRate}不一致`
        )
      }
    }

    // 将pcm数据丢进缓冲，凑够一帧发送，缓冲内的数据可能有多帧，循环切分发送
    if (pcm.length > 0) {
      this.realTimeSendTryChunks!.push({ pcm, pcmSampleRate })
    }

    // 从缓冲中切出一帧数据
    const chunkSize = this.sendFrameSize / (this.testBitRate / 8) // 8位时需要的采样数和帧大小一致，16位时采样数为帧大小的一半
    const framePcm = new Int16Array(chunkSize)
    let framePcmSampleRate = 0
    let pcmOK = false
    let pcmLen = 0
    
    // 调试信息：查看缓冲中的数据总量
    let totalAvailableSamples = 0
    for (let i = 0; i < this.realTimeSendTryChunks!.length; i++) {
      const chunk = this.realTimeSendTryChunks![i]
      const availableInChunk = chunk.pcm.length - (chunk.offset || 0)
      totalAvailableSamples += availableInChunk
    } 
    
    outerLoop: for (let i1 = 0; i1 < this.realTimeSendTryChunks!.length; i1++) {
      const chunk = this.realTimeSendTryChunks![i1]
      framePcmSampleRate = chunk.pcmSampleRate

      for (let i2 = chunk.offset || 0; i2 < chunk.pcm.length; i2++) {
        framePcm[pcmLen] = chunk.pcm[i2]
        pcmLen++

        // 满一帧了，清除已消费掉的缓冲
        if (pcmLen == chunkSize) {
          pcmOK = true
          chunk.offset = i2 + 1
          for (let i3 = 0; i3 < i1; i3++) {
            this.realTimeSendTryChunks!.splice(0, 1)
          }
          break outerLoop
        }
      }
    } 
    // 缓冲的数据不够一帧时，不发送 或者 是结束了
    if (!pcmOK) {
      if (isClose) {
        const number = ++this.realTimeSendTryNumber
        this.transferUpload(number, null, 0, null, isClose)
      }
      return
    }

    // 直接使用 PCM 数据，不需要转码为 Blob
    const number = ++this.realTimeSendTryNumber
    const encStartTime = Date.now()
    
    // 将 Int16Array 转换为 ArrayBuffer
    const pcmBuffer = framePcm.buffer
    
    // 直接上传 PCM 数据
    this.transferUpload(number, pcmBuffer, 0, null, false)

    // 循环调用，继续切分缓冲中的数据帧，直到不够一帧
    this.realTimeSendTry([], 0, isClose)
  }

  /**
   * 数据传输函数
   */
  private transferUpload(
    number: number,
    data: ArrayBuffer | null,
    duration: number,
    blobRec: any,
    isClose: boolean
  ): void {
    // console.log(number, blobOrNull, duration, blobRec, isClose)
    this.transferUploadNumberMax = Math.max(this.transferUploadNumberMax, number) 
    if (data) { 
      this.callback(data, duration)
    }

    if (isClose) {
      // console.log('isClose')
    }
  }
  public handleSendData(buffers: any[],options: {powerLevel: number;
        bufferDuration: number;
        bufferSampleRate: number}) {
     // 推入实时处理，因为是unknown格式，buffers和rec.buffers是完全相同的，只需清理buffers就能释放内存。
   
        this.realTimeSendTry(buffers, options.bufferSampleRate, false)
  }
  public reset() { 
    this.realTimeSendTryReset() 
  }
  public stop() {
     this.realTimeSendTry([], 0, true) // 最后一次发送
  }
  
} 