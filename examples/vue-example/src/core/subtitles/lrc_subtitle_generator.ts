import { Subtitles, SubtitleEntry, SubtitleFormat } from './subtitles';

/**
 * 抽象字幕生成器实现
 * <p>
 * 提供通用的文件写入功能，具体内容生成逻辑由子类实现
 * </p>
 */
export abstract class AbstractSubtitleGenerator {
    /**
     * 将Subtitles对象写入文件
     * 
     * @param subtitles Subtitles对象
     * @param file 目标文件内容字符串
     */
    async writeFile(subtitles: Subtitles, fileContent: string): Promise<void> {
        // 在TypeScript中，文件操作需要在运行时环境中实现
        // 这里只是表示该方法的存在
        const content = await this.generate(subtitles);
        // 实际的文件写入需要在具体使用时实现
    }

    /**
     * 将Subtitles对象生成为字符串
     * 
     * @param subtitles Subtitles对象
     * @return 字符串格式的字幕内容
     */
    abstract generate(subtitles: Subtitles): Promise<string>;
}

/**
 * LRC歌词生成器实现
 * <p>
 * 支持将Subtitles对象生成为LRC格式的歌词内容
 * </p>
 */
export class LrcSubtitleGenerator extends AbstractSubtitleGenerator {
    async generate(subtitles: Subtitles): Promise<string> {
        if (!subtitles) {
            throw new Error("Subtitles对象不能为空");
        }

        const entries = subtitles.entries;
        if (!entries || entries.length === 0) {
            return "";
        }

        let result = "";
        for (const entry of entries) {
            if (entry) {
                result += this.formatEntry(entry) + "\n";
            }
        }

        return result;
    }

    private formatEntry(entry: SubtitleEntry): string {
        let result = "";

        // 时间标签
        const startTime = this.formatTime(entry.startTime);
        result += "[" + startTime + "]";

        // 歌词文本
        if (entry.text) {
            result += entry.text;
        }

        return result;
    }

    private formatTime(milliseconds: number = 0): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const ms = milliseconds % 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // LRC通常使用2位毫秒（对于小于1000毫秒的完整三位数，使用两位表示）
        // 如果毫秒是10的倍数，使用2位格式；否则使用3位格式
        if (ms % 10 === 0) {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${Math.floor(ms / 10).toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
        }
    }
}