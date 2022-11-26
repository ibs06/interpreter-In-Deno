// denon run typescript_study\20221126.ts

// 자바스크립트 동적 타입언어 따라서 변수의 타입은 런타임에 결정
// 정적 타입언어 : 변수의 타입이 컴파일 타임에 결정
// 타입스크립트 : 자바스크립트의 모든 기능을 포함하면서 정적 타입을 지원하는 언어

// 9.1 타입추론
let v1 = 123;
// v1 = 'abc'; 'string' 형식은 'number' 형식에 할당할 수 없습니다.ts(2322)
// 변수 선언시 타입을 명시적으로 할당하지 않아도 숫자를 할당하여 타입추론을 통해 자동으로 숫자타입으로 인식됨

// 9.2 합타입을 통한 타입오류수정
let v2: number | string = 123;
v2 = "abc";
// number, string의 합타입으로 선언하여 타입오류가 발생하지 않도록 설정

// 9.3 타입의 종류 (기본형, 배열, 튜플)
const size: number = 123;
const isBig: boolean = size >= 100;
const msg: string = isBig ? "크다" : "작다";

const values: number[] = [1, 2, 3]; // 타입 [] 어레이
const values2: Array<number> = [1, 2, 3]; // 제네릭 느낌?

// values.push('a'); 타입에러

const data: [string, number] = [msg, size]; // 튜플타입

// 9.4 undefined, null
let v3: undefined = undefined;
let v4: null = null;
// v3 = 123; // '123' 형식은 'undefined' 형식에 할당할 수 없습니다.ts(2322) << 유니온 합타입과 정의할때 함께 사용

let v5: number | undefined = undefined;
v5 = 123;

// 9.5 특정 문자열 숫자열 리터럴을 타입 정의
let v6: 10 | 20 | 30;
v6 = 10;
// v6 = 15; // '15' 형식은 '10 | 20 | 30' 형식에 할당할 수 없습니다.ts(2322)

let v7: "경찰관" | "소방관";
// v7 =  '의사'; // '"의사"' 형식은 '"경찰관" | "소방관"' 형식에 할당할 수 없습니다.ts(2322)

// 9.6 any 모든 종류의 값 허용 = 자바 object
let value: any;
value = 123;
value = "456";
value = () => {};

// 9.7 void 리턴값 없기 / never 타입 최소 타입
function f1(): void {
  console.log("f1");
}

function f2(): never {
  throw new Error("some error");
}

// function f3() : never {
//     while(true){
//         // 무한
//     }
// }

// 9.8 객체타입 object객체 타입인데
let v: object;
v = { name: "abc" }; // 인터페이스 미사용시 name속성에 접근해도 타입에러가 발생
// console.log(v.name); //'object' 형식에 'name' 속성이 없습니다.ts(2339)
// console.log(v.props1); //'object' 형식에 'props1' 속성이 없습니다.ts(2339)

// 9.9 union타입, intersection 타입
let v8: (1 | 3 | 5) & (3 | 5 | 7); // 숫자 리터럴
v8 = 3;
// v8 = 1; //'1' 형식은 '3 | 5' 형식에 할당할 수 없습니다.ts(2322)

// 9.10 타입 키워드 별칭 줘서 선언 중복없이 재사용 가능
type Width = number | string;
let width: Width;
width = 100;
width = "100px";

// 9.11 enum 타입
enum Fruit {
  Apple,
  Banana,
  Orange,
}
const v9: Fruit = Fruit.Apple; // enum의 값을 값으로 사용
const v10: Fruit.Apple | Fruit.Banana = Fruit.Banana; // enum의 값을 타입으로 사용

// 9.12 enum 명시적 숫자값 할당
// 기본값 0
enum assignFruit {
  Apple,
  Banana = 5,
  Orange,
}

// 다른 값과 달리 열거타입은 객체로 존재하여 해당 객체를 런타임에 사용가능
// console.log(assignFruit.Apple, assignFruit.Banana, assignFruit.Orange); // 0 5 6 출력

//9.24 함수선언 타입 시그니처 설정
function getInfoText(name: string, age: number): string {
  const nameText = name;
  const ageText = age >= 35 ? "senior" : "junior";
  return `name : ${nameText} age : ${ageText}`;
}

const v11 = getInfoText("mike", 23);

// 9.25 변수 함수할당 방식 선언 구조   : () =>
const infoText: (name: string, age: number) => string = function (
  name: string,
  age: number
) {
  const nameText = name;
  const ageText = age >= 35 ? "senior" : "junior";
  return `name : ${nameText} age : ${ageText}`;
};

// 9.26 선택 매개변수
function getInfoText2(name: string, age: number, language?: string): string {
  const nameText = name;
  const ageText = age >= 35 ? "senior" : "junior";
  const lang = language ? "a" : "b"; // 검사를 꼭해야함!! 'lang' 이름을 찾을 수 없습니다.ts(2304)
  return `name : ${nameText} age : ${ageText} lang :${lang}`;
}

const v12 = getInfoText2("mike", 24);
const v13 = getInfoText2("mike", 24, "react");

// 9.29 매개변수 기본값 정의 타입추론으로 자동적용 + 기본값 적용시 자동으로 선택 매개변수로 처리됨!
function getInfoText3(name: string, age: number, language = "tt"): string {
  const nameText = name;
  const ageText = age >= 35 ? "senior" : "junior";
  const lang = language ? "a" : "b"; // 검사를 꼭해야함!! 'lang' 이름을 찾을 수 없습니다.ts(2304)
  return `name : ${nameText} age : ${ageText} lang :${lang}`;
}
const v14 = getInfoText3("mike", 24);
const v15 = getInfoText3("mike", 24, "react");

//{ v14: "name : mike age : junior lang :a", v15: "name : mike age : junior lang :a" }
// console.log({ v14, v15 });

// 9.30 나머지 매개변수
function getInfoText4(name: string, ...rest: string[]): string {
  for (const r in rest) {
    console.log(r);
  }
  return "a";
}

// 함수 내부에서 사용하는 this는 자동으로 any로 적용
// 첫번째 파라미터에 정의할수있는 함수내 this변수

// 인터페이스
interface Person {
  name: string;
  age?: number;
}

const p1: Person = { name: "mike" };

// 인터페이스 클래스
interface Person2 {
  name: string;
  age: number;
  isYoungerThan(age: number): boolean;
}
class SomePerson implements Person2 {
  name!: string;
  age!: number;
  construct(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  isYoungerThan(age: number): boolean {
    return this.age < age;
  }
}

// 기본 타입에 ex)String 추가하려면 declare global commend 사용
// 원시타입에 메서드 추가하기
// 동적타이핑 대응
// interface String {
//   getParam(this: string, index: number): string;
// }
declare global {
  interface String {
    getParam(this: string, index: number): string;
  }
}

function getParam(index: number) {
  return "getParam";
}

String.prototype.getParam = getParam;
//Property 'getParam' does not exist on type 'String'.deno-ts(2339)
//in both VS Code and the playground) . The fix is to make the interface global:
//https://stackoverflow.com/questions/13897659/extending-functionality-in-typescript
//getParam
console.log("asdf".getParam(1));
