export class Dog {
  constructor(public name: string) {}

  bark() {
    console.log(`${this.name} barked!`);
  }
}
