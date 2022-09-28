import { createPostEditor, displayAllPosts, section, content} from './dom.js'
import * as variables from './variables.js'
import './style.css'

let posts = document.createElement('ul')
posts.classList.add('posts')
document.body.appendChild(posts);

document.querySelector('header').style.display = 'none'
document.querySelector('.authenticateButton').addEventListener('click', authenticateUser)


// Keep logged in on every refresh
if(localStorage.getItem('token')){
    document.querySelector('form').style.display = 'none'
    document.querySelector('header').style.display = 'flex'
    document.querySelector('.newPost').addEventListener('click', createPost);
    displayPosts()  
}

// Authenticate user
function authenticateUser(){
    let user = {
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value
    }
    fetch(`${variables.API_LINK}/log-in`, { method: 'POST', mode: 'cors', headers: { "Content-Type": "application/json" }, body: JSON.stringify(user)})
        .then(response => {
            return response.json()
        })
        .then(response => {
            if (response.user){
                localStorage.setItem('token', response.token)
                document.querySelector('form').style.display = 'none'
                document.querySelector('header').style.display = 'flex'
                document.querySelector('.newPost').addEventListener('click', createPost, { once: true });
                displayPosts()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// Function to display posts
function displayPosts(){
    posts.textContent = ''; 
    fetch(`${variables.API_LINK}/posts`, { method: 'GET', mode: 'cors', headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json", "Accept": "application/json"  } })
        .then(function(response){
            return response.json();  
        })
        .then(function(response){
            displayAllPosts(response)
        })
        .catch(err => {
            console.log(err)
        })
}

// Function to create post
function createPost(){
    if (document.querySelector('.postEditor')){
        return
    }

    posts.textContent = ''
    createPostEditor()

    document.querySelector('.cancelButton').addEventListener('click', () => {
        document.querySelector('.postEditor').remove()
        displayPosts()
    })

    document.querySelector('.confirmButton').addEventListener('click', handleSubmit)

    document.querySelector('.newSectionButton').addEventListener('click', section)
}

function handleSubmit(){
    let newContent = content.map(obj => ({...obj}));

    content.forEach((elem, index) => {
        newContent[index].sectionTitle = elem.sectionTitle.value
        newContent[index].body = content[index].body.slice(0)
        newContent[index].body.forEach((item, position) => {
            newContent[index].body[position] = {text: item.value}
            Array.from(item.parentNode.lastChild.children).forEach(elem => {
                if (elem.checked){
                    newContent[index].body[position] = {...newContent[index].body[position], type: elem.value}
                    return
                }
            })
        })
    })

    let postValues = {
        title: document.querySelector('.titleInput').value,
        summary: document.querySelector('.summaryInput').value,
        content: newContent
    }
    fetch(`${variables.API_LINK}/new-post`, { mode: 'cors', method: 'post', headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(postValues)})
        .then(() => {
            document.querySelector('.postEditor').remove()
            displayPosts()
        })
        .catch(err => {
            console.log(err)
        })
}

export function publishPost(response, ev){
    for(let i=0; i < response.length; i++){
        if (response[i].publishPostDom === ev.target){
            let postValues = {
                title: response[i].title,
                content: response[i].content,
                summary: response[i].summary,
                published_status: true
            }
            fetch(`${variables.API_LINK}/post/` + response[i]._id, { mode: 'cors', method: 'PUT', headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(postValues)})
                .then(() => {
                    displayPosts()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}

export function unpublishPost(response, ev){
    for(let i=0; i < response.length; i++){
        if (response[i].unpublishPostDom === ev.target){
            let postValues = {
                title: response[i].title,
                content: response[i].content,
                summary: response[i].summary,
                published_status: false
            }
            fetch(`${variables.API_LINK}/post/` + response[i]._id, { mode: 'cors', method: 'PUT', headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(postValues)})
                .then(() => {
                    displayPosts()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}

// Function to update post
export function updatePost(response, ev){
    for(let i=0; i < response.length; i++){
        if (response[i].updatePostDom === ev.target){
            posts.textContent = ''
            createPostEditor('update', response[i].content)            
            document.querySelector('.titleInput').value = response[i].title
            document.querySelector('.summaryInput').value = response[i].summary

            document.querySelector('.cancelButton').addEventListener('click', () => {
                document.querySelector('.postEditor').remove()
                displayPosts()
            })
            
            document.querySelector('.confirmButton').addEventListener('click', () => {
                let newContent = content.map(obj => ({...obj}));

                content.forEach((elem, index) => {
                    newContent[index].sectionTitle = elem.sectionTitle.value
                    newContent[index].body = content[index].body.slice(0)
                    newContent[index].body.forEach((item, position) => {
                        newContent[index].body[position] = {text: item.value}
                        Array.from(item.parentNode.lastChild.children).forEach(elem => {
                            if (elem.checked){
                                newContent[index].body[position] = {...newContent[index].body[position], type: elem.value}
                                return
                            }
                        })
                    })
                })
                let postValues = {
                    title: document.querySelector('.titleInput').value,
                    content: newContent,
                    summary: response[i].summary,
                    published_status: response[i].published_status
                }
                fetch(`${variables.API_LINK}/post/` + response[i]._id, { mode: 'cors', method: 'PUT', headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(postValues)})
                    .then(() => {
                        document.querySelector('.postEditor').remove()
                        displayPosts()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
        }
    }
}

// Function to delete post
export function deletePost(response, ev){
    for(let i=0; i < response.length; i++){
        if (response[i].deletePostDom === ev.target){
            fetch(`${variables.API_LINK}/post/` + response[i]._id, { method: 'DELETE', mode: 'cors', headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`}})
                .then(response => {
                    displayPosts()
                })
                .catch(err => {
                    console.log(err)
                })
            break
        }
    }
}