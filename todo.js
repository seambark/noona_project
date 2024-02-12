// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할일이 추가된다.
// delete버튼을 누르면 할일이 삭제된다.
// check버튼을 누르면 할일이 끝나면서 밑줄이 간다.
// 끝난 할일은 되돌리기 버튼을 클릭하면 다시 되돌릴 수 있다.
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만.
// 전체탭을 누르면 다시 전체아이템으로 돌아옴.
// 모바일 버전에서도 확인할 수 있는 반응형 웹이다.


const addInput = document.querySelector("#add_input");
const addBtn = document.querySelector("#add_btn");
const todoList = document.querySelector("#list");
const tab = document.querySelector("#tab");
const tabLi = document.querySelectorAll("#tab li");


let todoListData = [];
let mode="all";
let filterList = [];

let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let dateString = year + '-' + month  + '-' + day;



addBtn.addEventListener("click", addList);
todoList.addEventListener("click", listStatus);
tab.addEventListener("click", tabList)

function randomId() {
    return '-' + Math.random().toString(36).substr(2,9);
}

function addList() {
    let listData = {
        id: randomId(),
        memo : addInput.value,
        date : dateString,
        isComplete: false
    }
    todoListData.push(listData);
    render();
}

function render() {
    let list = [];
    if(mode == "all") {
        list = todoListData;
    } else if(mode == "ing" || mode =="done") {
        list = filterList;
    }

    let tag ='';

    for(i=0; i<list.length; i++) {
        tag += `
            <li>
                <div class="memo ${list[i].isComplete==true?`complete`:``}">
                    <span class="date">${list[i].date}</span>
                    <div class="memo_text">
                        ${list[i].memo}
                    </div>
                    <span class="memo_status">
                        <span class="memo_check">
                            <input type="checkbox" name="todo_check" id="${list[i].id}" ${list[i].isComplete==true?`checked`:``}>
                            <i class="check_icon"></i>
                        </span>
                        <button type="button" class="delete_btn" data-id="${list[i].id}"><i class="trash_icon">삭제</i></button>
                    </span>
                </div>
            </li>
        `;
    }

    todoList.innerHTML=tag;
}

function toggleComplete(id) {
    let listIndex = todoListData.findIndex((item) => item.id == id);
    todoListData[listIndex].isComplete = !todoListData[listIndex].isComplete;
    render();
}



function listStatus(e) {
    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;
    let btnCheck = thisTarget.classList.contains("delete_btn");

    if(thisTag == "BUTTON" && btnCheck == true) {
        let deleteId = thisTarget.dataset.id;
        deleteList(deleteId)
        return;
    }

    if(thisTag == "INPUT") {
        let idCheck = thisTarget.getAttribute('id');
        toggleComplete(idCheck);
        return;
    }
}

function deleteList(id) {
    let listIndex = todoListData.findIndex((item) => item.id == id);

    todoListData.splice(listIndex,1);
    render();
}



function tabList(e) {
    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;
    mode = thisTarget.dataset.complete;
    filterList=[]

    if(thisTag == "BUTTON") {
        
        for(i=0; i<tabLi.length; i++){
            tabLi[i].classList.remove("on");
        }
       
        thisTarget.parentNode.classList.add("on");
      
        if(mode == "all") {
            render();
    
        } else if(mode == "ing") {;
            for(i=0; i<todoListData.length; i++){
                if(todoListData[i].isComplete === false) {
                    filterList.push(todoListData[i])
                }
            }
            render();
    
        } else if(mode == "done") {
            for(i=0; i<todoListData.length; i++){
                if(todoListData[i].isComplete === true) {
                    filterList.push(todoListData[i])
                }
            }
            render();
        }
    }
}
