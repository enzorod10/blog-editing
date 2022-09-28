import { publishPost, unpublishPost, deletePost, updatePost, handleSubmit } from './script.js'
import { DateTime } from 'luxon'

export let content = []

export function createPostEditor(update, postBeingUpdated){
    content = [];
    let newPost = document.createElement('newPost')
    newPost.classList.add('postEditor', "p-4")
    document.body.appendChild(newPost);

    let buttons = document.createElement('div');
    newPost.appendChild(buttons)
    buttons.classList.add('buttons')
    let newSection = document.createElement('button');
    buttons.appendChild(newSection);
    newSection.textContent = 'New Section';
    newSection.classList.add('newSectionButton', "bg-green-500", "hover:bg-green-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
    let confirmPost = document.createElement('button');
    confirmPost.textContent = 'Confirm'
    confirmPost.classList.add('confirmButton', "bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
    buttons.appendChild(confirmPost)
    let cancelPost = document.createElement('button');
    buttons.appendChild(cancelPost)
    cancelPost.textContent = 'Cancel'
    cancelPost.classList.add('cancelButton', "bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-2", "px-4", "rounded")

    // TITLE
    let titleLabel = document.createElement('label')
    titleLabel.classList.add('label')
    titleLabel.textContent = 'Title'
    titleLabel.setAttribute('for', 'editTitle')
    let title = document.createElement('input')
    title.classList.add('titleInput', 'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm', 'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full', 'p-2.5', 'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500')
    title.setAttribute('id', 'editTitle')

    // Summary
    let summaryLabel = document.createElement('label')
    summaryLabel.classList.add('summaryLabel')
    summaryLabel.textContent = 'Summary'
    summaryLabel.setAttribute('for', 'editSummary')
    let summary = document.createElement('textarea')
    summary.classList.add('summaryInput', 'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm', 'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full', 'p-2.5', 'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500')
    summary.setAttribute('id', 'editSummary')

    newPost.appendChild(titleLabel)
    newPost.appendChild(title)
    newPost.appendChild(summaryLabel)
    newPost.appendChild(summary)


    if (update === 'update'){
        document.querySelector('.newSectionButton').addEventListener('click', section)
        let count = 0;
        for(let i=0; i<postBeingUpdated.length; i++){
            section()
            document.querySelectorAll('.sectionTitle')[i].value = postBeingUpdated[i].sectionTitle
            for (let q=0; q<postBeingUpdated[i].body.length; q++){
                newParagraph(document.querySelectorAll('.section')[i], document.querySelectorAll('.sectionTitle')[i])
                Array.from(document.querySelectorAll('.paragraph'))[count].value = postBeingUpdated[i].body[q].text
                if (postBeingUpdated[i].body[q].type === 'css'){
                    document.querySelectorAll('.paragraphContainer')[count].lastChild.children[3].checked = true;
                }else if (postBeingUpdated[i].body[q].type === 'js'){
                    document.querySelectorAll('.paragraphContainer')[count].lastChild.children[5].checked = true;
                }else if (postBeingUpdated[i].body[q].type === 'markup'){
                    document.querySelectorAll('.paragraphContainer')[count].lastChild.children[1].checked = true;
                }
                count++;
            }
        }
    }
}

export function displayAllPosts(response){
    for(let i=0; i<response.length; i++){
        let item = document.createElement('li')
        document.querySelector('.posts').appendChild(item)
        document.querySelector('.posts').classList.add('divide-y-2', 'divide-blue-900', 'p-4')
        item.classList.add('post', "p-2")

        let title = document.createElement('div')
        title.classList.add('title')
        item.appendChild(title)
        title.textContent = response[i].title
        
        let summary = document.createElement('div')
        summary.classList.add('preview')
        item.appendChild(summary)
        summary.textContent = response[i].summary

        let date = document.createElement('div')
        date.classList.add('date')
        item.appendChild(date)
        let tempDate = new Date(response[i].timestamp)
        date.textContent = DateTime.fromJSDate(tempDate).toLocaleString(DateTime.DATE_FULL)

        // Handle buttons to update & delete posts
        let postButtons = document.createElement('div')
        postButtons.classList.add('postButtons')
        item.appendChild(postButtons)

        let updateButton = document.createElement('div')
        updateButton.classList.add('updateButton', "bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
        postButtons.appendChild(updateButton)
        updateButton.textContent = 'Update'
        response[i].updatePostDom = updateButton
        updateButton.addEventListener('click', ev => updatePost(response, ev))

        let deleteButton = document.createElement('div')
        deleteButton.classList.add('deleteButton', "bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
        postButtons.appendChild(deleteButton)
        deleteButton.textContent = 'Delete'
        response[i].deletePostDom = deleteButton
        deleteButton.addEventListener('click', ev => deletePost(response, ev))

        if(response[i].published_status){
            let unpublishButton = document.createElement('div')
            unpublishButton.classList.add('unpublishButton', "bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
            postButtons.appendChild(unpublishButton)
            unpublishButton.textContent = 'Unpublish'
            response[i].unpublishPostDom = unpublishButton
            unpublishButton.addEventListener('click', ev => unpublishPost(response, ev))
        } else {
            let publishButton = document.createElement('div')
            publishButton.classList.add('publishButton', "bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
            postButtons.appendChild(publishButton)
            publishButton.textContent = 'Publish'
            response[i].publishPostDom = publishButton
            publishButton.addEventListener('click', ev => publishPost(response, ev))
        }
    }
}

export function section(){
    let section = document.createElement('div')
    section.classList.add('section', 'border-4', 'border-purple-900', 'rounded-lg', 'p-2');

    let sectionTitleLabel = document.createElement('label')
    sectionTitleLabel.classList.add('label')
    sectionTitleLabel.textContent = 'Section Title'
    sectionTitleLabel.setAttribute('for', 'sectionTitle')
    section.appendChild(sectionTitleLabel)
    let sectionTitle = document.createElement('input')
    sectionTitle.classList.add('sectionTitle', 'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm', 'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full', 'p-2.5', 'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500')
    sectionTitle.setAttribute('id', 'sectionTitle')
    section.appendChild(sectionTitle)

    // Handle content array
    content.push({sectionTitle: sectionTitle, body: []})

    let removeSectionButton = document.createElement('button')
    removeSectionButton.textContent = 'Remove Section'
    removeSectionButton.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
    section.appendChild(removeSectionButton)

    removeSectionButton.addEventListener('click', () => {
        content.forEach((elem, index) => {
            if(elem.sectionTitle === sectionTitle){
                content.splice(index, 1)
            }
        })
        section.remove()
    })

    let newParagraphButton = document.createElement('button')
    newParagraphButton.textContent = 'New Paragraph'
    newParagraphButton.classList.add("bg-green-500", "hover:bg-green-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
    section.appendChild(newParagraphButton)
    
    document.querySelector('.postEditor').appendChild(section)

    newParagraphButton.addEventListener('click', () => newParagraph(section, sectionTitle))

}

function newParagraph(section, sectionTitle){
    let paragraphContainer = document.createElement('div')
    paragraphContainer.classList.add('paragraphContainer')
    let paragraph = document.createElement('textarea')
    paragraph.classList.add('paragraph', 'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm', 'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full', 'p-2.5', 'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400', 'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500')
    let removeParagraphButton = document.createElement('button')
    removeParagraphButton.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-2", "px-4", "rounded")
    removeParagraphButton.textContent = 'Remove Paragraph'

    // Checkboxes if code blocks
    let checkboxContainer = document.createElement('span');
    checkboxContainer.classList.add('checkboxContainer');
    let cssCheckbox = document.createElement('input');
    let cssCheckboxLabel = document.createElement('label');
    cssCheckbox.setAttribute('type', 'checkbox');
    cssCheckbox.setAttribute('value', 'css');
    cssCheckbox.setAttribute('style', 'padding: 0px 10px');
    let jsCheckbox = document.createElement('input');
    let jsCheckboxLabel = document.createElement('label');
    jsCheckbox.setAttribute('type', 'checkbox');
    jsCheckbox.setAttribute('value', 'js');
    jsCheckbox.setAttribute('style', 'padding: 0px 10px');
    let markupCheckbox = document.createElement('input');
    let markupCheckboxLabel = document.createElement('label');
    markupCheckbox.setAttribute('type', 'checkbox');
    markupCheckbox.setAttribute('value', 'markup');
    markupCheckbox.setAttribute('style', 'padding: 0px 10px');

    cssCheckboxLabel.setAttribute('style', 'padding: 0px 10px');
    jsCheckboxLabel.setAttribute('style', 'padding: 0px 10px');
    markupCheckboxLabel.setAttribute('style', 'padding: 0px 10px');

    cssCheckboxLabel.textContent = 'CSS';
    jsCheckboxLabel.textContent = 'JS';
    markupCheckboxLabel.textContent = 'MARKUP';

    cssCheckbox.addEventListener('click', ev => {
        jsCheckbox.checked = false
        markupCheckbox.checked = false
    })
    jsCheckbox.addEventListener('click', ev => {
        cssCheckbox.checked = false
        markupCheckbox.checked = false
    })
    markupCheckbox.addEventListener('click', ev => {
        cssCheckbox.checked = false
        jsCheckbox.checked = false
    })

    checkboxContainer.append(markupCheckboxLabel, markupCheckbox, cssCheckboxLabel, cssCheckbox, jsCheckboxLabel, jsCheckbox)
    
    for (let i=0; i<content.length; i++){
        if(content[i].sectionTitle === sectionTitle){
            content[i].body.push(paragraph)
        }
    }

    paragraphContainer.appendChild(paragraph)
    paragraphContainer.appendChild(removeParagraphButton)
    paragraphContainer.appendChild(checkboxContainer)

    removeParagraphButton.addEventListener('click', () => {
        content.forEach((elem, index) => {
            if(elem.sectionTitle === sectionTitle){
                content[index].body.forEach((elem, position) => {
                    if(elem === paragraph){
                        content[index].body.splice(position, 1)
                    }
                })
            }
        })
        paragraphContainer.remove()
        })

    section.appendChild(paragraphContainer)        
}
