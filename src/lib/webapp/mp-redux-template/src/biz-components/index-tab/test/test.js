
// 测试模板
import { formatName } from '../src/data-adapter';

test('formatName(name) 等于 [name]', () => {
    expect(formatName('name')).toBe('[name]');
});
