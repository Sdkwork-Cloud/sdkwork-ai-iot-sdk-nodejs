import { Subtitles, SubtitleEntry, SubtitleFormat } from './subtitles';
import { AbstractSubtitleGenerator } from './lrc_subtitle_generator';

/**
 * SRT字幕生成器实现
 * <p>
 * 支持将Subtitles对象生成为SRT格式的字幕内容
 * </p>
 */
export class SrtSubtitleGenerator extends AbstractSubtitleGenerator {
    async generate(subtitles: Subtitles): Promise<string> {
        if (!subtitles) {
            throw new Error("Subtitles对象不能为空");
        }

        const entries = subtitles.entries;
        if (!entries || entries.length === 0) {
            return "";
        }

        let result = "";
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry) {
                result += this.formatEntry(entry, i + 1);
                result += "\n\n";
            }
        }

        return result;
    }

    private formatEntry(entry: SubtitleEntry, index: number): string {
        let result = "";

        // 序号
        result += index + "\n";

        // 时间轴
        const startTime = this.formatTime(entry.startTime || 0);
        const endTime = this.formatTime(entry.endTime || 0);
        result += `${startTime} --> ${endTime}\n`;

        // 文本内容
        if (entry.texts && entry.texts.length > 0) {
            for (const text of entry.texts) {
                result += text + "\n";
            }
        } else if (entry.text) {
            result += entry.text + "\n";
        }

        return result.trim();
    }

    private formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const ms = milliseconds % 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
    }
}