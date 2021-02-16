import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
    apiKey: "AIzaSyCFaaPdafEpuxV5iXvjDbmKWsbZFfWA638",
    authDomain: "uploadphotosjs.firebaseapp.com",
    projectId: "uploadphotosjs",
    storageBucket: "uploadphotosjs.appspot.com",
    messagingSenderId: "158584948408",
    appId: "1:158584948408:web:8f82fc157a895e38aed64d"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})