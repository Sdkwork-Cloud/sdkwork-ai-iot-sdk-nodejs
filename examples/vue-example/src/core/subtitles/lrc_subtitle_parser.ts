import { Subtitles, SubtitleEntry, SubtitleFormat } from './subtitles';

/**
 * 抽象字幕解析器实现
 * <p>
 * 提供通用的文件读取功能，具体解析逻辑由子类实现
 * </p>
 */
export abstract class AbstractSubtitleParser {
    /**
     * 从文件解析字幕内容
     * 
     * @param file 包含字幕内容的文件内容字符串
     * @return 解析后的Subtitles对象
     */
    async parseFile(fileContent: string): Promise<Subtitles> {
        return this.parse(fileContent);
    }

    /**
     * 从字符串解析字幕内容
     * 
     * @param content 字符串格式的字幕内容
     * @return 解析后的Subtitles对象
     */
    abstract parse(content: string): Promise<Subtitles>;
}

/**
 * LRC歌词解析器实现
 * <p>
 * 支持解析LRC格式的歌词文件
 * </p>
 */
export class LrcSubtitleParser extends AbstractSubtitleParser {
    async parse(content: string): Promise<Subtitles> {
        if (!content || content.trim() === '') {
            throw new Error("歌词内容不能为空");
        }

        const subtitles: Subtitles = {
            format: SubtitleFormat.LRC,
            entries: []
        };

        const entries: SubtitleEntry[] = [];
        const lines = content.split(/\r?\n/);

        let sequence = 1;
        for (const line of lines) {
            if (line && line.trim() !== '') {
                const entry = this.parseLine(line, sequence);
                if (entry) {
                    entries.push(entry);
                    sequence++;
                }
            }
        }

        subtitles.entries = entries;
        return subtitles;
    }

    private parseLine(line: string, sequence: number): SubtitleEntry | null {
        // 检查是否为元数据行的正则表达式
        const metadataPattern = /\[([a-zA-Z]+):(.*)\]/;
        if (metadataPattern.test(line)) {
            // 这是元数据行，不作为字幕条目处理
            return null;
        }

        // 解析时间标签
        const timePattern = /\[(\d{2}):(\d{2})[.:](\d{2,3})\]/;
        const match = line.match(timePattern);
        if (match) {
            const entry: SubtitleEntry = {
                sequence: sequence
            };

            // 提取时间
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            let milliseconds = parseInt(match[3], 10);
            
            // 处理毫秒位数不同的情况
            // 如果是2位毫秒数（如.00），需要乘以10转换为标准毫秒数
            if (match[3].length === 2) {
                milliseconds *= 10;
            }

            const startTime = minutes * 60000 + seconds * 1000 + milliseconds;
            entry.startTime = startTime;
            // LRC格式通常没有明确的结束时间，这里简单处理
            entry.endTime = startTime + 5000; // 默认持续5秒

            // 提取歌词文本
            const text = line.replace(timePattern, '').trim();
            entry.text = text;
            entry.texts = [text];

            return entry;
        }

        return null;
    }
}