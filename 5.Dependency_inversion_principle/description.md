# Dependency inversion Principle

Entities must depend on abstractions not on concretions. It states that the high level module must not depend on the low level module, but they should depend on abstractions. |
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

> Объектом зависимости должна быть абстракция, а не что-то конкретное.

1. Модули верхних уровней не должны зависеть от модулей нижних уровней. Оба типа модулей должны зависеть от абстракций.
2. Абстракции не должны зависеть от деталей. Детали должны зависеть от абстракций.

В процессе разработки программного обеспечения существует момент, когда функционал приложения перестаёт помещаться в 
рамках одного модуля. Когда это происходит, нам приходится решать проблему зависимостей модулей. В результате, 
например, может оказаться так, что высокоуровневые компоненты зависят от низкоуровневых компонентов.

```typescript
class XMLHttpService extends XMLHttpRequestService {}

class Http {
  constructor (private xmlhttpService: XMLHttpService) {}
  
  get(url: string, options: any) {
      this.xmlhttpService.request(url, 'GET');
  }
  
  post() {
     this.xmlhttpService.request(url, 'POST'); 
  }
}
```

Здесь класс *`Http`* представляет собой высокоуровневый компонент, а *`XMLHttpService`* — низкоуровневый. Такая 
архитектура нарушает пункт **A** принципа инверсии зависимостей: **«Модули верхних уровней не должны зависеть от 
модулей нижних уровней. Оба типа модулей должны зависеть от абстракций»**.

Класс *`Http`* вынужденно зависит от класса *`XMLHttpService`*. Если мы решим изменить механизм, используемый классом 
*`Http`* для взаимодействия с сетью — скажем, это будет Node.js-сервис или, например, сервис-заглушка, применяемый для 
целей тестирования, нам придётся отредактировать все экземпляры класса *`Http`*, изменив соответствующий код. Это 
нарушает принцип открытости-закрытости.

Класс *`Http`* не должен знать о том, что именно используется для организации сетевого соединения. Поэтому мы создадим 
интерфейс *`Connection`*:

```typescript
interface Connection {
  request(url: string, opts: any);
}
```

Интерфейс *`Connection`* содержит описание метода *`request`* и мы передаём классу *`Http`* аргумент типа 
*`Connection`*:

```typescript
class Http {
  constructor(private httpConnection: Connection) {}
  
  get(url: string, options: any) {
      this.httpConnection.request(url, 'GET');
  }
  
  post() {
      this.httpConnection.request(url, 'POST');
  }
}
```

Теперь, вне зависимости от того, что именно используется для организации взаимодействия с сетью, класс *`Http`* может 
пользоваться тем, что ему передали, не заботясь о том, что скрывается за интерфейсом *`Connection`*.

Перепишем класс *`XMLHttpService`* таким образом, чтобы он реализовывал этот интерфейс:

```typescript
class XMLHttpService implements Connection {
  const xhr = new XMLHttpRequest();
  
  request(url: string, opts: any) {
      xhr.open();
      xhr.send();
  }
}
```

В результате мы можем создать множество классов, реализующих интерфейс *`Connection`* и подходящих для использования в 
классе *`Http`* для организации обмена данными по сети:

```typescript
class NodeHttpService implements Connection {
  request(url: string, opts: any) {}
}

class MockHttpService implements Connection {
  request(url: string, opts: any) {}
}
```

Как можно заметить, здесь высокоуровневые и низкоуровневые модули зависят от абстракций. Класс *`Http`* 
(высокоуровневый модуль) зависит от интерфейса *`Connection`* (абстракция). Классы *`XMLHttpService`*, 
*`NodeHttpService`* и *`MockHttpService`* (низкоуровневые модули) также зависят от интерфейса *`Connection`*.

Кроме того, стоит отметить, что следуя принципу инверсии зависимостей, мы соблюдаем и принцип подстановки Барбары 
Лисков. А именно, оказывается, что типы *`XMLHttpService`*, *`NodeHttpService`* и *`MockHttpService`* могут служить 
заменой базовому типу *`Connection`*.