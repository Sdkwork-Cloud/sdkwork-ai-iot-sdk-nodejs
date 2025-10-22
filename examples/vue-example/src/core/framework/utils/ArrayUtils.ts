export default class ArrayUtils{
    static insertBefore<T>(array: T[], index: number, newElement: T): T[] {
        // 检查索引是否有效
        if (index < 0 || index > array.length) {
            throw new Error("Index out of bounds");
        }
        // 使用 splice 方法在指定索引前插入元素
        array.splice(index, 0, newElement);
        return array;
    }
    static insertAfter<T>(array: T[], index: number, newElement: T): T[] {
        // 检查索引是否有效
        if (index < 0 || index >= array.length) {
            throw new Error("Index out of bounds");
        }
        // 使用 splice 方法在指定索引后插入元素
        array.splice(index + 1, 0, newElement);
        return array;
    }
}