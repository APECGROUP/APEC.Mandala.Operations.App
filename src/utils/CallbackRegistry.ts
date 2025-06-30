import { ResponseImageElement } from '../interface/Verify.interface';

type ImageCallback = (image: ResponseImageElement) => void;

class CallbackRegistry {
  private callbacks: Map<string, ImageCallback> = new Map();

  register(id: string, callback: ImageCallback): void {
    this.callbacks.set(id, callback);
  }

  execute(id: string, image: ResponseImageElement): void {
    const callback = this.callbacks.get(id);
    if (callback) {
      callback(image);
      this.callbacks.delete(id); // Clean up after execution
    }
  }

  unregister(id: string): void {
    this.callbacks.delete(id);
  }
}

export const callbackRegistry = new CallbackRegistry();
