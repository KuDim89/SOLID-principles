# Open-closed Principle


Objects or entities should be open for extension, but closed for modification. |
------------------------------------------------------------------------------ |

> Программные сущности (классы, модули, функции) должны быть открыты для расширения, но не для модификации.

**Продолжим работу над классом *`Animal`*.**

```typescript
class Animal {
  constructor(name: string) {}
  getAnimalName() {}
}
```

Мы хотим перебрать список животных, каждое из которых представлено объектом класса *`Animal`*, и узнать о том, какие звуки 
они издают. Представим, что мы решаем эту задачу с помощью функции *`AnimalSounds`*:

```typescript
const animals: Array<Animal> = [
    new Animal('lion'),
    new Animal('mouse')
];

function AnimalSound(a: Array<Animal>) {
  for(let i = 0; i <= a.length; i++) {
      if(a[i].name === 'lion') {
          return 'roar';
      } else if (a[i].name === 'mouse') {
          return 'squeak';
      } else {
          return 'No information about this animal' 
      }
  }
}

AnimalSound(animals);
```

Самая главная проблема такой архитектуры заключается в том, что функция определяет то, какой звук издаёт то или иное 
животное, анализируя конкретные объекты. Функция *`AnimalSound`* не соответствует принципу открытости-закрытости, так 
как, например, при появлении новых видов животных, нам, для того, чтобы с её помощью можно было бы узнавать звуки, 
издаваемые ими, придётся её изменить.

Добавим в массив новый элемент:

```typescript
const animals: Array<Animal> = [
    new Animal('lion'),
    new Animal('mouse'),
    new Animal('snake')
];
```

После этого нам придётся поменять код функции *`AnimalSound`*:

```typescript
function AnimalSound(a: Array<Animal>) {
  for(let i = 0; i <= a.length; i++) {
      if(a[i].name === 'lion') {
          return 'roar';
      } else if (a[i].name === 'mouse') {
          return 'squeak';
      } else if (a[i].name === 'snake') {
          return 'hiss';
      } else {
          return 'No information about this animal' 
      }
  }
}

AnimalSound(animals);
```

Как видите, при добавлении в массив нового животного придётся дополнять код функции. Пример это очень простой, но если 
подобная архитектура используется в реальном проекте, функцию придётся постоянно расширять, добавляя в неё новые 
выражения `if`.

Как привести функцию *`AnimalSound`* в соответствие с принципом открытости-закрытости? Например — так:

```typescript
class Animal {
  makeSound(){};
}

class Lion extends Animal{
  makeSound() {
      return 'roar';
  }
}

class Mouse extends Animal{
  makeSound() {
      return 'squeak';
  }
}

class Snake extends Animal{
  makeSound() {
      return 'hiss';
  }
}

function AnimalSound(a: Array<Animal>) {
  for(let i = 0; i <= a.length; i++) {
      a[i].makeSound();
  }
}

AnimalSound(animals);
```

Можно заметить, что у класса *`Animal`* теперь есть виртуальный метод *`makeSound`*. При таком подходе нужно, чтобы 
классы, предназначенные для описания конкретных животных, расширяли бы класс *`Animal`* и реализовывали бы этот метод.

В результате у каждого класса, описывающего животного, будет собственный метод *`makeSound`*, а при переборе массива с 
животными в функции *`AnimalSound`* достаточно будет вызвать этот метод для каждого элемента массива.

Если теперь добавить в массив объект, описывающий новое животное, функцию *`AnimalSound`* менять не придётся. Мы 
привели её в соответствие с принципом открытости-закрытости.

**Рассмотрим ещё один пример.**

Представим, что у нас есть магазин. Мы даём клиентам скидку в 20%, используя такой класс:

```typescript
class Discount {
  giveDiscount() {
      return this.price * 0.2
  }
}
```

Теперь решено разделить клиентов на две группы. Любимым (*`fav`*) клиентам даётся скидка в 20%, а VIP-клиентам (*`vip`*) — 
удвоенная скидка, то есть — 40%. Для того, чтобы реализовать эту логику, было решено модифицировать класс следующим 
образом:

```typescript
class Discount {
  giveDiscount() {
      if(this.customer === 'fav') {
          return this.price * 0.2;
      }
      if(this.customer === 'vip') {
        return this.price * 0.4;
      }
  }
}
```

Такой подход нарушает принцип открытости-закрытости. Как видно, здесь, если нам надо дать некоей группе клиентов особую 
скидку, приходится добавлять в класс новый код.

Для того чтобы переработать этот код в соответствии с принципом открытости-закрытости, добавим в проект новый класс, 
расширяющий класс *`Discount`*. В этом новом классе мы и реализуем новый механизм:

```typescript
class VIPDiscount: Discount {
  getDiscount() {
    return super.getDiscount() * 2;
  }
}
```
Если решено дать скидку в 80% «супер-VIP» клиентам, выглядеть это должно так:

```typescript
class SuperVIPDiscount: VIPDiscount {
  getDiscount() {
    return super.getDiscount() * 2;
  }
}
```

Как видите, тут используется расширение возможностей классов, а не их модификация.