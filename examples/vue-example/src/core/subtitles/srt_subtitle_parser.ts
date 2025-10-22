import { Subtitles, SubtitleEntry, SubtitleFormat } from './subtitles';
import { AbstractSubtitleParser } from './lrc_subtitle_parser';

/**
 * SRT字幕解析器实现
 * <p>
 * 支持解析SRT格式的字幕文件
 * </p>
 */
export class SrtSubtitleParser extends AbstractSubtitleParser {
    async parse(content: string): Promise<Subtitles> {
        if (!content || content.trim() === '') {
            throw new Error("字幕内容不能为空");
        }

        const subtitles: Subtitles = {
            format: SubtitleFormat.SRT,
            entries: []
        };

        const entries: SubtitleEntry[] = [];
        const blocks = content.trim().split(/\n\s*\n/);

        for (const block of blocks) {
            if (block && block.trim() !== '') {
                const entry = this.parseBlock(block);
                if (entry) {
                    entries.push(entry);
                }
            }
        }

        subtitles.entries = entries;
        return subtitles;
    }

    private parseBlock(block: string): SubtitleEntry | null {
        const lines = block.split(/\n/);
        if (lines.length < 3) {
            return null;
        }

        try {
            const entry: SubtitleEntry = {
                sequence: parseInt(lines[0].trim(), 10)
            };

            // 解析时间轴
            const timeLine = lines[1].trim();
            const times = timeLine.split('-->');
            if (times.length >= 2) {
                entry.startTime = this.parseTime(times[0].trim());
                entry.endTime = this.parseTime(times[1].trim());
            }

            // 解析文本内容
            let text = '';
            const texts: string[] = [];
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    if (text.length > 0) {
                        text += "\n";
                    }
                    text += line;
                    texts.push(line);
                }
            }

            entry.text = text;
            entry.texts = texts;
            return entry;
        } catch (e) {
            // 解析失败，返回null
            return null;
        }
    }

    private parseTime(timeString: string): number {
        try {
            // 格式: HH:MM:SS,mmm
            const parts = timeString.split(/[:,]/);
            if (parts.length >= 3) {
                const hours = parseInt(parts[0], 10);
                const minutes = parseInt(parts[1], 10);
                const seconds = parseInt(parts[2], 10);
                const milliseconds = parts.length > 3 ? parseInt(parts[3], 10) : 0;

                return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
            }
        } catch (e) {
            // 解析失败
        }
        return 0;
    }
}