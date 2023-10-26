// 회고
// 자바스크립트에서 import를 사용하는 방법과 상태관리 하는 방법을 알게되었다. 다른 프로젝트에 적용해보고 싶다.
// 한 파일에 객체가 하나만 있는게 유지보수도 편리하고 코드 가독성 측면에서도 좋다는 것을 알게되었다.
// html 태그에 dataset으로 동적 Id를 부여하는 방법이 편리해보였다. 아이템이 삭제될 때는 id를 다시 부여해야한다.
// this는 객체 자신을 가리키고 여러개의 인스턴스가 생성될 때 인스턴스 밖에서 상태나 메서드에 접근할 수 있게 한다.

// step2 요구사항 구현을 위한 전략

// TODO localStorage data read and write
// - [x] [localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)에 데이터를 저장한다.
//  - [x] 메뉴를 추가할 때
//  - [x] 메뉴를 수정할 때
//  - [x] 메뉴를 삭제할 때
// - [x] [localStorage]에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 read and rendering
// - [x] 페이지가 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO
// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [x] 클릭 이벤트에서 가장 가까운 li 태그의 class속성 값에 sold-out을 추가한다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = () => {
    if (
      store.getLocalStorage() &&
      store.getLocalStorage()[this.currentCategory].length > 0
    ) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="${
          menuItem.soldOut ? "sold-out" : ""
        } w-100 pl-2 menu-name">${menuItem.name}</span>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;

    updateMenuCount();
  };
  const updateMenuCount = () => {
    // const menuCount = document.querySelectorAll("li").length;
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const submitMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const MenuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: MenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    // $menuName.innerText = updatedMenuName;
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      // e.target.closest("li").remove();
      //updateMenuCount();
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", submitMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;

      submitMenuName();
    });

    $(".nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        render();
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      }
    });
  };
}

let app = new App();
app.init();
