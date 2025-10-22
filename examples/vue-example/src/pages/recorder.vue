<style>
body{
	word-wrap: break-word;
	background:#f5f5f5 center top no-repeat;
	background-size: auto 680px;
}
pre{
	white-space:pre-wrap;
}
a{
	text-decoration: none;
	color:#06c;
}
a:hover{
	color:#f00;
}

.main{
	max-width:700px;
	margin:0 auto;
	padding-bottom:80px
}

.mainBox{
	margin-top:12px;
	padding: 12px;
	border-radius: 6px;
	background: #fff;
	--border: 1px solid #0b1;
	box-shadow: 2px 2px 3px #aaa;
}


.btns button{
	display: inline-block;
	cursor: pointer;
	border: none;
	border-radius: 3px;
	background: #0b1;
	color:#fff;
	padding: 0 15px;
	margin:3px 20px 3px 0;
	line-height: 36px;
	height: 36px;
	overflow: hidden;
	vertical-align: middle;
}
.btns button:active{
	background: #0a1;
}
.pd{
	padding:0 0 6px 0;
}
.lb{
	display:inline-block;
	vertical-align: middle;
	background:#00940e;
	color:#fff;
	font-size:14px;
	padding:2px 8px;
	border-radius: 99px;
}
</style>


<template>
<div class="main">
	<slot name="top"></slot>

	<div class="mainBox">
		<div class="pd">
			类型：{{ type }}
			<span style="margin:0 20px">
			比特率: <input type="text" v-model="bitRate" style="width:60px"> kbps
			</span>
			采样率: <input type="text" v-model="sampleRate" style="width:60px"> hz
		</div>

		<div class="btns">
			<div>
				<button @click="recOpen">打开录音,请求权限</button>
				<button @click="recClose">关闭录音,释放资源</button>
			</div>
			
			<button @click="recStart">录制</button>
			<button @click="recStop" style="margin-right:80px">停止</button>
			
			<span style="display: inline-block;">
				<button @click="recPause">暂停</button>
				<button @click="recResume">继续</button>
			</span>
			<span style="display: inline-block;">
				<button @click="recPlayLast">播放</button>
				<button @click="recUploadLast">上传</button>
				<button @click="recDownLast">本地下载</button>
			</span>
		</div>
	</div>

	<div class="mainBox">
		<div style="height:100px;width:300px;border:1px solid #ccc;box-sizing: border-box;display:inline-block;vertical-align:bottom" class="ctrlProcessWave"></div>
		<div style="height:40px;width:300px;display:inline-block;background:#999;position:relative;vertical-align:bottom">
			<div class="ctrlProcessX" style="height:40px;background:#0B1;position:absolute;" :style="{width:powerLevel+'%'}"></div>
			<div class="ctrlProcessT" style="padding-left:50px; line-height:40px; position: relative;">{{ durationTxt+"/"+powerLevel }}</div>
		</div>
	</div>
	
	<div class="mainBox">
		<!-- 放一个 <audio ></audio> 播放器，标签名字大写，阻止uniapp里面乱编译 -->
		<audio ref="LogAudioPlayer" style="width:100%"></audio>

		<div class="mainLog">
			<div v-for="obj in logs" :key="obj.idx">
				<div :style="{color:obj.color==1?'red':obj.color==2?'green':obj.color}">
					<!-- <template v-once> 在v-for里存在的bug，参考：https://v2ex.com/t/625317 -->
					<span v-once>[{{ getTime() }}]</span><span v-html="obj.msg"/>
					
					<template v-if="obj.res">
						{{ intp(obj.res.rec.set.bitRate,3) }}kbps
						{{ intp(obj.res.rec.set.sampleRate,5) }}hz
						编码{{ intp(obj.res.blob.size,6) }}b
						[{{ obj.res.rec.set.type }}]{{ obj.res.durationTxt }}ms 
						
						<button @click="recdown(obj.idx)">下载</button>
						<button @click="recplay(obj.idx)">播放</button>

						<span v-html="obj.playMsg"></span>
						<span v-if="obj.down">
							<span style="color:red">{{ obj.down }}</span>
							
							没弹下载？试一下链接或复制文本<button @click="recdown64(obj.idx)">生成Base64文本</button>

							<textarea v-if="obj.down64Val" v-model="obj.down64Val"></textarea>
						</span>
					</template>
				</div>
			</div>
		</div>
	</div>

	<slot name="bottom"></slot>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/pcm'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

// 状态
const type = ref('pcm')
const bitRate = ref(16)
const sampleRate = ref(16000)
const duration = ref(0)
const durationTxt = ref('0')
const powerLevel = ref(0)
const logs = ref([])
const recLogLast = ref(null)
const LogAudioPlayer = ref(null)

// 录音实例
const rec = ref(null)
const wave = ref(null)
const Rec = Recorder

// 方法
const recOpen = () => {
  const newRec = Recorder({
    type: type.value,
    bitRate: +bitRate.value,
    sampleRate: +sampleRate.value,
    onProcess: (buffers, power, dur, rate) => {
      duration.value = dur
      durationTxt.value = formatMs(dur, 1)
      powerLevel.value = power 
      wave.value?.input(buffers[buffers.length-1], power, rate)
    }
  })

  newRec.open(
    () => {
      reclog(`已打开:${type.value} ${sampleRate.value}hz ${bitRate.value}kbps`, 2)
      wave.value = Recorder.WaveView({elem:".ctrlProcessWave"})
      rec.value = newRec
    },
    (msg, isUserNotAllow) => {
      reclog(`${isUserNotAllow?"UserNotAllow，":""}打开失败：${msg}`, 1)
    }
  )
}

const recClose = () => {
  if (rec.value) {
    rec.value.close()
    rec.value = null
    reclog("已关闭")
  } else {
    reclog("未打开录音", 1)
  }
}

const recStart = () => {
  if (!rec.value || !Recorder.IsOpen()) {
    reclog("未打开录音", 1)
    return
  }
  rec.value.start()
  const set = rec.value.set
  reclog(`录制中：${set.type} ${set.sampleRate}hz ${set.bitRate}kbps`)
}

const recPause = () => {
  if (rec.value && Recorder.IsOpen()) {
    rec.value.pause()
  } else {
    reclog("未打开录音", 1)
  }
}

const recResume = () => {
  if (rec.value && Recorder.IsOpen()) {
    rec.value.resume()
  } else {
    reclog("未打开录音", 1)
  }
}

const recStop = () => {
  if (!(rec.value && Recorder.IsOpen())) {
    reclog("未打开录音", 1)
    return
  }
  
  rec.value.stop(
    (blob, dur) => {
      reclog("已录制:", "", {
        blob,
        duration: dur,
        durationTxt: formatMs(dur),
        rec: rec.value
      })
    },
    (err) => {
      reclog(`录音失败：${err}`, 1)
    }
  )
}

const recPlayLast = () => {
  if (!recLogLast.value) {
    reclog("请先录音，然后停止后再播放", 1)
    return
  }
  recplay(recLogLast.value.idx)
}

const recUploadLast = () => {
  if (!recLogLast.value) {
    reclog("请先录音，然后停止后再上传", 1)
    return
  }
  
  const blob = recLogLast.value.res.blob
  const api = "http://127.0.0.1:9528"
  
  const onreadystatechange = (xhr, title) => {
    return () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          reclog(`${title}上传成功 <span style="color:#999">response: ${xhr.responseText}</span>`, 2)
        } else {
          reclog(`${title}没有完成上传，演示上传地址无需关注上传结果，只要浏览器控制台内Network面板内看到的请求数据结构是预期的就ok了。`, "#d8c1a0")
          console.error(`${title}上传失败`, xhr.status, xhr.responseText)
        }
      }
    }
  }
  
  reclog(`开始上传到${api}，请稍候... （你可以先到源码 /assets/node-localServer 目录内执行 npm run start 来运行本地测试服务器）`)

  // 方式一：Base64上传
  const reader = new FileReader()
  reader.onloadend = () => {
    let postData = `mime=${encodeURIComponent(blob.type)}`
    postData += `&upfile_b64=${encodeURIComponent((/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1])}`
    
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `${api}/uploadBase64`)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = onreadystatechange(xhr, "上传方式一【Base64】")
    xhr.send(postData)
  }
  reader.readAsDataURL(blob)

  // 方式二：FormData上传
  const form = new FormData()
  form.append("upfile", blob, "recorder.mp3")
  
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${api}/upload`)
  xhr.onreadystatechange = onreadystatechange(xhr, "上传方式二【FormData】")
  xhr.send(form)
}

const recDownLast = () => {
  if (!recLogLast.value) {
    reclog("请先录音，然后停止后再下载", 1)
    return
  }
  recdown(recLogLast.value.idx)
}

const reclog = (msg, color, res) => {
  const obj = {
    idx: logs.value.length,
    msg,
    color,
    res,
    playMsg: "",
    down: 0,
    down64Val: ""
  }
  if (res?.blob) {
    recLogLast.value = obj
  }
  logs.value.unshift(obj)
}

const recplay = (idx) => {
  const o = logs.value[logs.value.length - idx - 1]
  o.play = (o.play || 0) + 1
  
  const logmsg = (msg) => {
    o.playMsg = `<span style="color:green">${o.play}</span> ${getTime()} ${msg}`
  }
  logmsg("")

  const audio = LogAudioPlayer.value
  audio.controls = true
  if (!(audio.ended || audio.paused)) {
    audio.pause()
  }
  audio.onerror = () => {
    logmsg(`<span style="color:red">播放失败[${audio.error.code}]${audio.error.message}</span>`)
  }
  audio.src = (window.URL || webkitURL).createObjectURL(o.res.blob)
  audio.play()
}

const recdown = (idx) => {
  const o = logs.value[logs.value.length - idx - 1]
  o.down = (o.down || 0) + 1

  const res = o.res
  const name = `rec-${res.duration}ms-${res.rec.set.bitRate||"-"}kbps-${res.rec.set.sampleRate||"-"}hz.${res.rec.set.type||(/\w+$/.exec(res.blob.type)||[])[0]||"unknown"}`
  
  const downA = document.createElement("A")
  downA.href = (window.URL || webkitURL).createObjectURL(res.blob)
  downA.download = name
  downA.click()
}

const recdown64 = (idx) => {
  const o = logs.value[logs.value.length - idx - 1]
  const reader = new FileReader()
  reader.onloadend = () => {
    o.down64Val = reader.result
  }
  reader.readAsDataURL(o.res.blob)
}

const getTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}

const formatMs = (ms, all) => {
  const ss = ms % 1000
  ms = (ms - ss) / 1000
  const s = ms % 60
  ms = (ms - s) / 60
  const m = ms % 60
  const h = (ms - m) / 60
  
  let t = h ? h + ":" : ""
  t += (all || h + m ? m.toString().padStart(2, '0') + ":" : "")
  t += (all || h + m + s ? s.toString().padStart(2, '0') + "″" : "")
  t += ss.toString().padStart(3, '0')
  return t
}

const intp = (s, len) => {
  s = s == null ? "-" : s + ""
  return s.length >= len ? s : ("_______" + s).slice(-len)
}

// 初始化
onMounted(() => {
  Rec.a = 1 // 防止tree-shaking
})
</script>