// denon run typescript_study\20230122.ts

// 이펙티브 타입스크립트 177p
// - 인터페이스 속성 값을 이용한 타입 확인
/**
 *  Node Statement Expression
 *
 */
interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
}

type Person = Name | PersonWithBirth;

let object2: Person =
  1 == 1
    ? {
        name: "bar",
        placeOfBirth: "placeOfBirth",
      }
    : {
        name: "bar",
      };

if ("placeOfBirth" in object2) {
  console.log("PersonWithBirth");
} else {
  console.log("Name");
}
// 출력결과 : PersonWithBirth

// 함수타입 인터페이스나 타입으로 정의
// 이펙티브 타입스크립트 70p
type TFn = (x: number) => string;
// 짧으면 타입
interface IFn {
  (x: number): string;
}
const toStrT: TFn = (x) => "" + x;
const toStrI: IFn = (x) => "" + x;

// 타입스크립트 undefined처리

const token: number | undefined = 1 == 1 ? 1 : undefined;
toStrT(token as number); // 명시적 타입선언 넘버 처리
// 특정 순간에 변수의 value의 타입을 결정할 수 없을 때가 있습니다.
// 끝에 느낌표를 붙임으로써 Typescript 컴파일러에게 변수는 undefined 또는 null이 될 수 없음을 강제로 알릴 수 있습니다.
toStrT(token!); // = toStrT(token as number);
