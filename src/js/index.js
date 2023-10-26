import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";

// step3 회고
// 다시 제작한다면?
// 1. 웹서버 연동
// 2. BASE_URL 변수명 먼저 선언
// 3. 데이터를 요청하고 화면을 렌더링
// 4. API 함수 제작(CRUD)
// 5. 리팩터링
// - localStorage 부분 지우기
// - API 파일 따로 제작,
// - 페이지 렌더링과 관련해서 중복되는 부분 제거,
// - 서버 요청할 때 option 객체
// - 카테고리 버튼 클릭 시 콜백함수 분리
// 6. 사용자 경험

// step3 요구사항 구현을 위한 전략
// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴가 추가될 수 있도록 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [x] 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [x] 서버에 메뉴의 품절상태를 토글될 수 있도록 요청한다.
// - [x] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리팩터링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.
// - [x] 중복되는 메뉴는 추가할 수 없다.

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        return `<li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2">
        <span class="${
          menuItem.isSoldOut ? "sold-out" : ""
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
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const submitMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );

    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);

    $("#menu-name").value = "";
    render();
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, menuId, updatedMenuName);

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      $("#menu-name").value = "";
      render();
    }
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

    $(".nav").addEventListener("click", changeCategory);
  };
}

let app = new App();
app.init();
