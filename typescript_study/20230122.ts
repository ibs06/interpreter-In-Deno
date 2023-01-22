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
