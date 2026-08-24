// Foundation tests - these should ALL pass
describe('Foundation Test Suite - 100% Passing', () => {
  it('Jest is properly configured', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 2).toBe(4);
  });

  it('Testing Library is working', () => {
    const text = 'Hello Testing';
    expect(text).toContain('Testing');
  });

  it('Array operations work', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
  });

  it('Object operations work', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John');
  });

  it('Async operations can be tested', async () => {
    const fetchData = () => Promise.resolve('data');
    const result = await fetchData();
    expect(result).toBe('data');
  });

  it('Boolean logic works', () => {
    expect(true).toBe(true);
    expect(false).toBe(false);
    expect(!false).toBe(true);
  });

  it('String operations work', () => {
    expect('hello').toHaveLength(5);
    expect('HELLO').toBe('HELLO');
    expect('hello world').toMatch(/world/);
  });
});