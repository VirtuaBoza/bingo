export default interface Action<T> {
  type: string;
  payload: T;
}
