class Animal {
    constructor(name) {
        this.name = name;
    }
}

const swimmer = {
  swim() {
      console.log(`${this.name} can swim`);
  }
};

const flier = {
    fly() {
        console.log(`${this.name} can fly`);
    }
};

const walker = {
    walk() {
        console.log(`${this.name} can walk`);
    }
};

class Dog extends Animal {}

class Eagle extends Animal {}

class Whale extends Animal {}

Object.assign(Dog.prototype, swimmer, walker);
Object.assign(Eagle.prototype, walker, flier);
Object.assign(Whale.prototype, swimmer);

const dog =  new Dog('Lucky');
dog.walk();
dog.swim();

const eagle = new Eagle('Majesty');
eagle.walk();
eagle.fly();

const whale = new Whale('Grey');
whale.swim();