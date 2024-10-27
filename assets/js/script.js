const columns = document.querySelectorAll(".column__cards")
const trash = document.querySelector(".deleteTrash")
let draggedCard


const saveTasks = () => {
    const tasks = Array.from(columns).map(column => {
        return Array.from(column.querySelectorAll(".card")).map(card => card.textContent)
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))
}


const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"))
    if (tasks) {
        tasks.forEach((columnTasks, index) => {
            columnTasks.forEach(taskContent => {
                const card = document.createElement("section")
                card.className = "card"
                card.draggable = "true"
                card.textContent = taskContent

                card.addEventListener("dragstart", dragStart)
                card.addEventListener("focusout", () => {
                    card.contentEditable = "false"
                    if (!card.textContent) card.remove()
                    saveTasks()
                })
                
                columns[index].append(card)
            })
        })
    }
}


const dragStart = (event) => {
    draggedCard = event.target
    event.dataTransfer.effectAllowed = "move"
}

const dragOver = (event) => {
    event.preventDefault()
}

const dragEnter = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.add("column--highlight")
    } else if (target.classList.contains("deleteTrash")) {
        target.classList.add("deleteTrashHover")
    }
}

const dragLeave = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.remove("column--highlight")
    } else if (target.classList.contains("deleteTrash")) {
        target.classList.remove("deleteTrashHover")
    }
    
}




const createCard = ({ target }) => {
    if (!target.classList.contains("column__cards")) return

    const card = document.createElement("section")
    card.className = "card"
    card.draggable = "true"
    card.contentEditable = "true"

    const deleteBtn = document.createElement("button")
    const icon = document.createElement("i")
    deleteBtn.append(icon)

    icon.className = "fa-solid fa-x deleteBtn"

    card.addEventListener("focusout", () => {
        card.contentEditable = "false"
        if (!card.textContent) card.remove()
        saveTasks()
    })

    card.addEventListener("dragstart", dragStart)
    target.append(card)
    card.focus()
}

const drop = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.remove("column--highlight")
        target.append(draggedCard)
        saveTasks()
    } else if (target.classList.contains("deleteTrash")) {
        target.classList.remove("deleteTrashHover")

        draggedCard.remove()

        saveTasks()
    }
}




columns.forEach((column) => {
    column.addEventListener("dragover", dragOver)
    column.addEventListener("dragenter", dragEnter)
    column.addEventListener("dragleave", dragLeave)
    column.addEventListener("drop", drop)
    column.addEventListener("dblclick", createCard)
})


trash.addEventListener("dragover", dragOver)
trash.addEventListener("dragenter", dragEnter)
trash.addEventListener("dragleave", dragLeave)
trash.addEventListener("drop", drop)


loadTasks()

