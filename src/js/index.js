// step2 요구사항 구현을 위한 전략

// TODO localStorage data read and write
// - [ ] [localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)에 데이터를 저장한다.
// - [ ] [localStorage]에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [ ] 에스프레소 메뉴판 관리
// - [ ] 프라푸치노 메뉴판 관리
// - [ ] 블렌디드 메뉴판 관리
// - [ ] 티바나 메뉴판 관리
// - [ ] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 read and rendering
// - [ ] 페이지가 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [ ] 에스프레소 메뉴를 페이지에 그려준다.

// TODO
// - [ ] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
// - [ ] 품절 버튼을 추가한다.
// - [ ] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [ ] 클릭 이벤트에서 가장 가까운 li 태그의 class속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = document.querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const submitMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;

    const menuItemTemplate = (menuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${menuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // const menuName = e.target.parentNode.querySelector(".menu-name");

    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", submitMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    submitMenuName();
  });
}

App();

// let a = new App();
