let audio_player: any = null;
export default class AudioPlayer {
    id: string;
    playerElement?: HTMLAudioElement;
    constructor(id: string) {
        this.id = id
    }
    play(url: string) {
        let el: HTMLAudioElement | null = document.getElementById(this.id) as HTMLAudioElement;

        el && el.pause();
        if (!el) {
            el = document.createElement('audio');
            el.src = url; // 替换为你的音频文件路径 
            el.controls = true;
            el.setAttribute("class", "hidden")
            el.id = this.id;
            el.style.display = "none";
            // el.crossOrigin="anonymous";
            document.body.appendChild(el);
        } else {
            el.src = url;
        }
        this.playerElement = el;
        audio_player = el;
        setTimeout(() => {
            el.play();
        }, 100);
    }
    on(event: string, callback: any) {
        const audio: HTMLAudioElement = this.playerElement as HTMLAudioElement;
        if(!callback){
            callback=()=>{
                console.log("audio event",event)
            }
        }
        audio.addEventListener(event, callback);  
    }
    pause() {
        if (audio_player) {
            audio_player.pause();
        }
    }
    stop() {
        if (audio_player) {
            audio_player.pause();
            audio_player.currentTime = 0; // 重置音频到开始位置
        }
    }
} 