let colors = {
    "settings__color--red": "#FF9AA2",
    "settings__color--salmon": "#FFB7B2",
    "settings__color--orange": "#FFDAC1",
    "settings__color--yellow": "#E2F0CB",
    "settings__color--green": "#B5EAD7",
    "settings__color--purple": "#C7CEEA"
};

const cleanClassName = (name) => {
    return name.toLowerCase().split(' ').join('')
};

const colorClass = (_class) => {
    _class.style.backgroundColor = "lightgray";
    let color = localStorage.getItem(cleanClassName(_class.children[0].innerText) + 'Color');
    if (color != null) {
        _class.style.backgroundColor = color;
    }
}

const classBehaviour = (_class) => {
    _class.addEventListener("click", (e) => {
        // When clicking on it, update the name of the grades section
        let name = e.target.children[0].innerText;
        document
            .getElementsByClassName("grades")[0]
            .getElementsByClassName("grades__label")[0].innerText = name;

        // Update the grades section to the class selected
        let grades = document.getElementsByClassName('grades__list');
        for (let j = 0; j < grades.length; j++) {
            if (grades[j].id == cleanClassName(name) + 'Grades') {
                if (grades[j].classList.contains('hidden')) {
                    grades[j].classList.remove('hidden');
                }
            }
            else {
                if (!(grades[j].classList.contains('hidden'))) {
                    grades[j].classList.add('hidden');
                }
            }
        }
    });
}

const settingsBehaviour = (setting) => {
    setting.addEventListener("click", (e) => {
        let parent = e.target.parentElement;
        let settings = parent.getElementsByClassName("class__settings")[0];

        if (settings.classList.contains("hidden")) {
            settings.classList.remove("hidden");
        } else {
            settings.classList.add("hidden");
        }
    });
}

const colorsBehaviour = (color) => {
    color.addEventListener("click", (e) => {
        let parent = e.target.parentElement.parentElement.parentElement;
        parent.style.backgroundColor = colors[e.target.classList[1]];

        let name = parent.children[0].innerText;
        localStorage.setItem(cleanClassName(name) + 'Color', colors[e.target.classList[1]]);
    });
}

window.addEventListener('load', loadData);

/*
document.addEventListener("DOMContentLoaded", function () {
    // Class grades & Default colors
    let classes = document.getElementsByClassName("classes__class");
    for (let i = 0; i < classes.length; i++) {
        colorClass(classes[i]);
        classBehaviour(classes[i]);
    }

    // Class settings menu
    let settingsElements = document.getElementsByClassName("class__settingsIcon");
    for (let i = 0; i < settingsElements.length; i++) {
        settingsBehaviour(settingsElements[i]);
    }

    // Class colors
    let colorElements = document.getElementsByClassName("settings__color");
    for (let i = 0; i < colorElements.length; i++) {
        colorsBehaviour(colorElements[i]);
    }
});
*/