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



const main = () => {
    let loc = new URL(window.location.href);
    switch (loc.pathname) {
        case '/HomeAccess/Classes/Classwork':
            classwork();
            break;
    }
};

const classwork = () => {
    let iframe = document.querySelector('.sg-legacy-iframe');
    const getData = () => {
        // Load the iframe and find the classes
        let classes = iframe.contentDocument.querySelectorAll('div.AssignmentClass');
        var classAssignments = {};

        // Go through each class
        for (let i = 0; i < classes.length; i++) {
            // Get the name of the class
            let name = classes[i].querySelector('a.sg-header-heading').innerText.split(' ');
            name.splice(0, 3);
            name = name.join(' ');

            // If the class has assignments, find those elements
            let assignments = {};
            try {
                // Get the assignment elements
                let assignmentElements = null;
                assignmentElements = classes[i].querySelector('table').querySelectorAll('tr.sg-asp-table-data-row');
                // Go through each assignment
                for (let j = 0; j < assignmentElements.length; j++) {
                    // Get the assignment's name, points, and total points, then add it to class's assignments
                    const assignmentName = assignmentElements[j].querySelector('a').innerText;
                    const assignmentPoints = assignmentElements[j].querySelectorAll('td')[4].innerText;
                    const assignmentTotalPoints = assignmentElements[j].querySelectorAll('td')[5].innerText;
                    assignments[assignmentName] = { 'points': assignmentPoints, 'totalPoints': assignmentTotalPoints };
                }

                // Add the overall grade to the class
                grade = classes[i].querySelectorAll('table')[2].querySelectorAll('td')[5].innerText;
                assignments['grade'] = grade;
            } catch (error) {
                // Because there are no assignments, there are no grades
                assignments['grade'] = 'None';
            }

            // Add this class to the overall classes
            classAssignments[name] = assignments;
        }

        return classAssignments;
    };

    const loadNewView = (data) => {
        console.log(data);
        // Setup the page for the new view
        document.head.innerHTML += `<link href="${chrome.extension.getURL('classwork/styles.css')}" rel="stylesheet" type="text/css">`
        iframe.parentElement.innerHTML += `<div id="hac-plus-content" style="all: initial;"></div>`;
        document.querySelector('.sg-legacy-iframe').remove();
        let cont = document.querySelector('#hac-plus-content');

        // Set up containers & scripts
        cont.innerHTML += `<div class="classes"></div>`;
        let classes = cont.querySelector('.classes');
        cont.innerHTML += `<div class="grades"></div>`;
        let grades = cont.querySelector('.grades');
        cont.innerHTML += `<script src=${chrome.extension.getURL('classwork/index.js')}></script>`;
    
        // Set up classes
        cont.querySelector('.classes').innerHTML += `
            <p class="classes__label">Classes</p>
            <div class="classes__classes">
            </div>
        `;

        for (let c in data) {
            cont.querySelector('.classes__classes').innerHTML += `
          <div class="classes__class">
            <p class="class__name">${c}</p>
            <p class="class__percent">${data[c]['grade']}%</p>
            <p class="class__settingsIcon fa fa-gear"></p>
            <div class="class__settings hidden">
              <p class="settings__label">Settings for ${c}</p>
              <div>
                <div class="settings__color settings__color--red"></div>
                <div class="settings__color settings__color--salmon"></div>
                <div class="settings__color settings__color--orange"></div>
                <div class="settings__color settings__color--yellow"></div>
                <div class="settings__color settings__color--green"></div>
                <div class="settings__color settings__color--purple"></div>
              </div>
            </div>
          </div>
            `;
        }
        let classesContainers = cont.querySelectorAll('.classes__class');
        console.log(classesContainers);
        for (let i = 0; i < classesContainers.length; i++) {
            colorClass(classesContainers[i]);
            classBehaviour(classesContainers[i]);
        }
    };

    loadNewView(getData());

};

window.addEventListener('load', main);