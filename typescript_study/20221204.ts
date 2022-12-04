// denon run typescript_study\20221204.ts

// 인터페이스 타입호환성
interface Person {
  name: string;
  age: number;
}

// 인터페이스 상속하기
interface Korean extends Person {
  isLiveInSeoul: boolean;
}
/*
결과 
interface Korean {
    +name: string;
    +age: number;
    isLiveInSeoul: boolean;
}
*/

// 인터페이스 다중상속 지원
interface Programmer {
  favoriteProgrammingLanguage: string;
}

interface Employee extends Person, Programmer {
  isLiveInSeoul: boolean;
}
/*
결과 
interface Korean {
    +name: string;
    +age: number;
    +favoriteProgrammingLanguage: string;
    isLiveInSeoul: boolean;
}
*/

// 교차타입 모든 속성값 포함 -> 인터페이스 합치기
interface Product {
  name: string;
  price: number;
}

type PP = Person & Product;

const pp: PP = {
  name: "a",
  age: 23,
  price: 1000,
};
console.log(pp);

// 타입호환성 어떤 타입을 다른 타입으로 취급해도 되는가?
// 어떤 변수가 다른 변수에 할당 가능하기 위해서는 해당 변수의 타입이 다른 쪽 변수에 타입에 할당 가능해야한다.

// 타입 A가 타입 B에 할당 가능하다. 타입B가 할 수 있는 일은 A가 할수 있다
// 타입 A는 B의 서브타입이다.

// 구조에 의한 서브타입을 사용하는 경우,
// 타입 검사기는 클래스 사이의 상속 관계 대신 클래스의 구조 즉 각 클래스에 어떤 필드와 메서드가 있는지 고려한다.
// 만약 클래스 A가 클래스 B에 정의된 필드와 메서드를 모두 정의한다면 A는 B의 서브타입이다. \

// 타입스크립트 구조에 의한 타이핑 즉 duck typing지원(Golang) <-> 이름에 의한 서브타입(Java)

interface PersonSub {
  name: string;
  age: number;
}
interface ProductSub {
  name: string;
  // ProductSub < PersonSub 서브 타입 되려면 적어야된다.
  //price: number; property 'price' is missing in type 'PersonSub' but required in type 'ProductSub'
}
const personSub: PersonSub = { name: "mike", age: 23 };
const productSub: ProductSub = personSub;
console.log(productSub);

// productSub instanceof PersonSub 가 되는지 체크하는게 되나 했더니..
// https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
// Approaching 9 years since OP, and this problem remains. I really REALLY want to love Typescript.
// And usually I succeed. But its loopholes in type safety is a foul odor that my pinched nose can't block.

interface Foo {
  type: "foo"; // 인터페이스명과 완전히 동일해도 문제 없겠는데?
  fooProperty: string;
}

interface Bar {
  type: "bar";
  barProperty: number;
}

type Node = Foo | Bar;

let object2: Node =
  1 == 1
    ? {
        type: "bar",
        barProperty: 123,
      }
    : {
        type: "foo",
        fooProperty: "string",
      };

// You will see errors if `strictNullChecks` is enabled.
// 타입ㄱ
if (object2.type === "foo") {
  // object has type `Foo`.
  console.log(object2.fooProperty);
} else {
  // object has type `Bar`.
  console.log(object2.barProperty);
}
