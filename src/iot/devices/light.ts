export class Light {
  private _name: string;
  private _state: boolean;

  constructor(name: string, state: boolean) {
    this._name = name;
    this._state = state;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get state(): boolean {
    return this._state;
  }

  set state(state: boolean) {
    this._state = state;
  }
}
