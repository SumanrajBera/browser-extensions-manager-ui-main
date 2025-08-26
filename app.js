// Selecting the extension grid with it's id

let extensionGrid = document.querySelector("#extensions-grid")

let extensionCtrlBtnGrp = document.querySelector("#extensions-ctrl_btn-grp")
let allBtn = document.querySelector(".all")
let activeBtn = document.querySelector(".active")
let inactiveBtn = document.querySelector(".inactive")

let dataStatus = "all"

let data;

const loadData = async () => {
    try {
        let res = await fetch('./data.json');
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

function createAndInsertCard(logo, title, desc, status, dataId) {
    let extensionCard = document.createElement("div")
    let extensionCardDets = document.createElement("div")
    let extensionCardUtility = document.createElement("div")
    let description = document.createElement("div")
    let switchBox = document.createElement("div")
    let switchBtn = document.createElement("div")

    let imgLogo = document.createElement("img")
    let cardTitle = document.createElement("h3")
    let cardDesc = document.createElement("p")
    let removeBtn = document.createElement("button")


    imgLogo.setAttribute("src", logo)
    cardTitle.innerText = title;
    cardDesc.innerText = desc;

    description.classList.add("description")
    description.appendChild(cardTitle)
    description.appendChild(cardDesc)


    extensionCardDets.classList.add("extensionCard_details")
    extensionCardDets.appendChild(imgLogo)
    extensionCardDets.appendChild(description)

    removeBtn.innerText = "Remove"
    removeBtn.classList.add("removeBtn")
    switchBox.classList.add("switch")
    if (status) {
        switchBox.classList.add("activated")
    }
    switchBtn.classList.add("switch_button")
    switchBox.appendChild(switchBtn)

    extensionCardUtility.classList.add("extensionCard_utility")
    extensionCardUtility.appendChild(removeBtn)
    extensionCardUtility.appendChild(switchBox)

    extensionCard.classList.add("extensionCard")
    extensionCard.setAttribute("data-id", dataId)
    extensionCard.appendChild(extensionCardDets)
    extensionCard.appendChild(extensionCardUtility)

    extensionGrid.appendChild(extensionCard)
}

function cardGenerator(data) {
    for (let i = 0; i < data.length; i++) {
        const { logo, name: title, description: desc, isActive: status, indx } = data[i]
        createAndInsertCard(logo, title, desc, status, indx)
    }
}

const main = async (dataStatus) => {
    if (!data) {
        data = await loadData();
        data = data.map((card, indx) => ({
            ...card,
            indx
        }))
    }

    extensionGrid.innerHTML = ""

    if (dataStatus == "all") {
        cardGenerator(data)
    } else if (dataStatus == "active") {
        tempData = data.filter((card) => card.isActive === true)
        cardGenerator(tempData)
    } else {
        tempData = data.filter((card) => card.isActive === false)
        cardGenerator(tempData)
    }

}

main(dataStatus)

function removeFromData(indx) {
    data = data.filter((card) => card.indx != indx)
}

function inverseState(indx) {
    data = data.map((card) => {
        if (card.indx == indx) {
            return { ...card, isActive: !card.isActive }
        }
        return card
    })
}

extensionGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeBtn")) {
        let parent = e.target.closest("[data-id]")
        removeFromData(parent.getAttribute("data-id"))
        parent.remove()
        return;
    }


    if (e.target.classList.contains("switch") || e.target.classList.contains("switch_button")) {
        // Get the card container
        let parentCard = e.target.closest("[data-id]")
        let parentId = parentCard.getAttribute("data-id")

        // If .switch_button was clicked, we want the actual .switch element (its parent)
        let switchElement = e.target.classList.contains("switch_button")
            ? e.target.parentElement
            : e.target

        // Toggle activated
        switchElement.classList.toggle("activated")

        // Update state in data
        inverseState(parentId)

        if (dataStatus === "active") {
            activeBtn.click()
        } else if (dataStatus === "inactive") {
            inactiveBtn.click()
        }
    }
})

function dataAndStatusChange(e, status) {
    let element = extensionCtrlBtnGrp.querySelector("button.activated");
    if (e.target !== element) {
        element.classList.toggle("activated")
        e.target.classList.add("activated")
    }
    main(dataStatus = status)
}

allBtn.addEventListener("click", (e) => { dataAndStatusChange(e, "all") })

activeBtn.addEventListener("click", (e) => { dataAndStatusChange(e, "active") })

inactiveBtn.addEventListener("click", (e) => { dataAndStatusChange(e, "inactive") })


const themeBtn = document.querySelector("#nav-btn")

function changeTheme() {
    const lightSrc = "./assets/images/icon-moon.svg"
    const darkSrc = "./assets/images/icon-sun.svg"
    const lightLogo = "./assets/images/logo.svg"
    const darkLogo = "./assets/images/logo-dark.svg"

    let btnEl = themeBtn.querySelector("#theme-img");
    let btnElSrc = btnEl.getAttribute("src");
    btnEl.setAttribute("src", btnElSrc === lightSrc ? darkSrc : lightSrc)

    let body = document.querySelector("body")
    let logo = document.querySelector(".logo>img")

    if (btnElSrc === lightSrc) {
        body.classList.remove("light")
        body.classList.add("dark")
        logo.setAttribute("src", darkLogo)
    } else {
        body.classList.remove("dark")
        body.classList.add("light")
        logo.setAttribute("src", lightLogo)
    }
}

themeBtn.addEventListener("click", changeTheme)