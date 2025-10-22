/**
 * 音频工具类
 * 提供PCM到WAV转换等功能
 */

export class AudioUtils {
  /**
   * 将PCM数据转换为WAV格式
   * @param pcmData - PCM音频数据
   * @param sampleRate - 采样率（默认16000）
   * @param numChannels - 声道数（默认1）
   * @param bitsPerSample - 采样位数（默认16）
   * @returns WAV格式的Blob对象
   */
  static pcmToWav(
    pcmData: ArrayBuffer | Int16Array | Float32Array,
    sampleRate: number = 16000,
    numChannels: number = 1,
    bitsPerSample: number = 16
  ): Blob {
    // 确保输入数据是ArrayBuffer
    let dataBuffer: ArrayBuffer;
    
    if (pcmData instanceof ArrayBuffer) {
      dataBuffer = pcmData;
    } else if (pcmData instanceof Int16Array) {
      dataBuffer = pcmData.buffer.slice(0) as ArrayBuffer;
    } else if (pcmData instanceof Float32Array) {
      // 将浮点数转换为16位整数
      const int16Array = new Int16Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        int16Array[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32767));
      }
      dataBuffer = int16Array.buffer.slice(0);
    } else {
      throw new Error('不支持的PCM数据类型');
    }

    // 计算WAV文件大小
    const dataLength = dataBuffer.byteLength;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // WAV文件头
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // PCM格式块大小
    view.setUint16(20, 1, true); // PCM格式
    view.setUint16(22, numChannels, true); // 声道数
    view.setUint32(24, sampleRate, true); // 采样率
    view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true); // 字节率
    view.setUint16(32, numChannels * bitsPerSample / 8, true); // 块对齐
    view.setUint16(34, bitsPerSample, true); // 采样位数
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true); // 数据大小

    // 复制PCM数据
    const data = new Uint8Array(buffer, 44);
    const source = new Uint8Array(dataBuffer);
    data.set(source);

    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * 写入字符串到DataView
   */
  private static writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * 检测音频数据格式
   * @param data - 音频数据
   * @returns 音频格式类型
   */
  static detectAudioFormat(data: Blob | ArrayBuffer): 'pcm' | 'wav' | 'unknown' {
    if (data instanceof Blob) {
      const type = data.type.toLowerCase();
      if (type.includes('wav')) return 'wav';
      if (type.includes('pcm')) return 'pcm';
      if (type.includes('audio')) {
        // 检查是否是WAV格式
        return 'unknown';
      }
    }
    
    // 如果是ArrayBuffer，尝试检测WAV文件头
    if (data instanceof ArrayBuffer && data.byteLength >= 12) {
      const header = new Uint8Array(data, 0, 12);
      const headerStr = String.fromCharCode.apply(null, Array.from(header));
      if (headerStr.includes('RIFF') && headerStr.includes('WAVE')) {
        return 'wav';
      }
    }
    
    return 'unknown';
  }

  /**
   * 将音频数据转换为浏览器可播放的格式
   * @param audioData - 音频数据
   * @param sampleRate - 采样率（默认16000）
   * @returns 可播放的Blob对象
   */
  static convertToPlayableFormat(
    audioData: Blob | ArrayBuffer | Int16Array | Float32Array,
    sampleRate: number = 16000
  ): Blob {
    // 如果已经是Blob且是WAV格式，直接返回
    if (audioData instanceof Blob && audioData.type.includes('wav')) {
      return audioData;
    }

    // 检测格式 - 先处理非ArrayBuffer类型
    let formatInput: Blob | ArrayBuffer;
    
    if (audioData instanceof Blob) {
      formatInput = audioData;
    } else if (audioData instanceof ArrayBuffer) {
      formatInput = audioData;
    } else {
      // 对于TypedArray，先转换为ArrayBuffer进行检测
      formatInput = audioData.buffer.slice(0) as ArrayBuffer;
    }
    
    const format = this.detectAudioFormat(formatInput);
    
    if (format === 'wav') {
      if (audioData instanceof Blob) {
        return audioData;
      } else if (audioData instanceof ArrayBuffer) {
        return new Blob([audioData], { type: 'audio/wav' });
      }
    }

    // 如果是PCM格式，转换为WAV
    if (format === 'pcm' || format === 'unknown') {
      let pcmBuffer: ArrayBuffer;
      
      if (audioData instanceof Blob) {
        // 需要异步处理，这里先返回一个占位符
        throw new Error('Blob格式的PCM数据需要异步处理');
      } else if (audioData instanceof ArrayBuffer) {
        pcmBuffer = audioData;
      } else if (audioData instanceof Int16Array || audioData instanceof Float32Array) {
        pcmBuffer = audioData.buffer.slice(0) as ArrayBuffer;
      } else {
        throw new Error('不支持的音频数据类型');
      }

      return this.pcmToWav(pcmBuffer, sampleRate);
    }

    throw new Error('无法识别的音频格式');
  }

  /**
   * 异步将Blob转换为ArrayBuffer
   * @param blob - Blob对象
   * @returns ArrayBuffer
   */
  static async blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * 计算音频时长（毫秒）
   * @param dataSize - 数据大小（字节）
   * @param sampleRate - 采样率
   * @param numChannels - 声道数
   * @param bitsPerSample - 采样位数
   * @returns 时长（毫秒）
   */
  static calculateDuration(
    dataSize: number,
    sampleRate: number = 16000,
    numChannels: number = 1,
    bitsPerSample: number = 16
  ): number {
    const bytesPerSecond = sampleRate * numChannels * bitsPerSample / 8;
    const durationSeconds = dataSize / bytesPerSecond;
    return Math.round(durationSeconds * 1000);
  }
}